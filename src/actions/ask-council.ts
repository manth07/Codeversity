'use server';

// Input preferences
export interface SessionPreferences {
    topic: string;
    ageGroup: string;
    difficulty: string;
    learningStyle: string;
    mode?: 'explain' | 'practice' | 'hybrid'; // Added hybrid
    language?: string;
    outputType?: 'text_audio' | 'text_only' | 'video';
    questionCount?: number; // 5, 10, 15
    questionType?: 'mixed' | 'conceptual' | 'coding' | 'case_study' | 'deep_problem';
}

// ------------------------------------------------------------------
// HELPER: Clean JSON
// ------------------------------------------------------------------
function cleanJson(text: string) {
    // Remove markdown code blocks if present
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

// ------------------------------------------------------------------
// HELPER: Clean and extract Mermaid diagram
// ------------------------------------------------------------------
function extractMermaidDiagram(text: string): string {
    // Remove any JSON artifacts that might have leaked in
    const lines = text.split('\n');
    const diagramLines: string[] = [];
    let inDiagram = false;
    let type = '';

    for (const line of lines) {
        let trimmed = line.trim();

        // Start of diagram (Strict check)
        const match = trimmed.match(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap)/);
        if (match) {
            inDiagram = true;
            type = match[1];
            diagramLines.push(trimmed);
            continue;
        }

        // Stop on JSON syntax or end of block
        if (inDiagram && (trimmed.includes('"keyClaims"') || trimmed.includes('"mainContent"') || trimmed.includes('```') || trimmed === '}')) {
            break;
        }

        // Strict content check to avoid parsing Math equations as diagrams
        if (inDiagram && trimmed) {
            // Reject lines that look like pure math equations (common AI hallucination in diagram fields)
            if (trimmed.includes('=') && trimmed.includes('(') && !trimmed.includes('>') && !trimmed.includes('[')) {
                // Likely a math formula like "x = (-b...)", ignore it unless it's strictly a label
                // But wait, labels usually are in [] or ().
                // If it DOES NOT have typical mermaid connectors (--> or ---), it might be junk.
                // Sequence diagram uses ->, so be careful.
                if (type.startsWith('graph') || type.startsWith('flowchart')) {
                    if (!trimmed.includes('-->') && !trimmed.includes('---') && !trimmed.includes('subgraph') && !trimmed.includes('end')) {
                        // Likely invalid for flowcharts unless it's a style def
                        if (!trimmed.startsWith('classDef') && !trimmed.startsWith('style') && !trimmed.startsWith('linkStyle')) {
                            continue;
                        }
                    }
                }
            }

            diagramLines.push(trimmed);
        }
    }

    let diagram = diagramLines.join('\n');

    // ---------------------------------------------------------
    // CLEANUP PASS 1: Fix Common Structure Errors
    // ---------------------------------------------------------

    // Fix: [Label]ID -> ID[Label] (Common AI mistake)
    diagram = diagram.replace(/\[([\w\s]+)\](\w+)/g, '$2[$1]');

    // Fix: (Label)ID -> ID(Label)
    diagram = diagram.replace(/\(([\w\s]+)\)(\w+)/g, '$2($1)');

    // Fix: Malformed arrow endings >| -> |
    diagram = diagram.replace(/\|>/g, '|');

    // Fix: "-> |text|" to "-->|text|" for Graphs (Sequence uses ->)
    if (type.startsWith('graph') || type.startsWith('flowchart')) {
        diagram = diagram.replace(/->/g, '-->');
        diagram = diagram.replace(/-->-->/g, '-->'); // Fix double replace
    }

    // ---------------------------------------------------------
    // CLEANUP PASS 2: Sanitize Labels
    // ---------------------------------------------------------
    diagram = diagram
        // CRITICAL: Remove newlines within node labels
        .replace(/\[([^\]]*)\]/g, (match, label) => {
            const cleanLabel = label
                .replace(/\\n/g, ' ')
                .replace(/\n/g, ' ')
                .replace(/["']/g, '') // Remove quotes in labels
                .replace(/\s+/g, ' ')
                .replace(/\(/g, '') // RemoveParens to prevent breakout
                .replace(/\)/g, '')
                .trim();
            return `[${cleanLabel}]`;
        })
        .replace(/\(([^)]*)\)/g, (match, label) => {
            const cleanLabel = label
                .replace(/\\n/g, ' ')
                .replace(/\n/g, ' ')
                .replace(/["']/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            return `(${cleanLabel})`;
        })
        // Remove problematic characters
        .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII
        .replace(/\\/g, '/'); // Swap backslashes

    return diagram;
}

// ------------------------------------------------------------------
// CORE: OLLAMA CLIENT (Local AI)
// ------------------------------------------------------------------
async function generateWithOllama(model: string, prompt: string) {
    try {
        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                format: "json", // Llama 3 supports strict JSON mode
                stream: false,
                options: {
                    temperature: 0.7 // Creative but structured
                },
                keep_alive: "5m" // Keep model loaded briefly, but allow easy swap
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const parsed = JSON.parse(data.response);

        // Clean the mermaidDiagram field if it exists
        if (parsed.mermaidDiagram) {
            parsed.mermaidDiagram = extractMermaidDiagram(parsed.mermaidDiagram);
        }

        return parsed;
    } catch (error) {
        console.error("[Council] Ollama Connection Failed:", error);
        throw error;
    }
}

// ------------------------------------------------------------------
// MAIN ACTION
// ------------------------------------------------------------------
export async function askCouncil(sessionId: string, preferences: SessionPreferences) {
    console.log(`[Council] 🔴 PROCESSING ON LOCAL AI | Request: ${preferences.topic}`);

    // "Astra Stack" Model Configuration (Optimized for 8GB VRAM)
    // NOTE: For 8GB VRAM, we need small efficient models.
    const MODELS = {
        TUTOR: "deepseek-r1:8b",     // Chain of Thought (Primary Driver)
        // Switch Council to a lighter model if memory is tight. 
        // Phi-4 is heavy. Fallback to Llama3.2 or Phi-3 if needed. 
        // User requested 8GB optimization.
        COUNCIL: "phi4",
        FALLBACK: "llama3"
    };

    try {
        // ---------------------------------------------------------
        // STEP 1: THE TUTOR AGENT (DeepSeek R1)
        // ---------------------------------------------------------
        console.log(`[Council] Contacting Tutor using ${MODELS.TUTOR}...`);

        const language = preferences.language || 'English';
        const qCount = preferences.questionCount || 5;

        // Build Unified Prompt to handle Hybrid Intent
        const tutorPrompt = `
        You are the 'Universal Teaching Agent'.
        
        USER REQUEST: "${preferences.topic}"
        
        CONTEXT:
        - Audience: ${preferences.ageGroup}
        - Difficulty: ${preferences.difficulty}
        - Style: ${preferences.learningStyle}
        - Language: Generate ALL content in ${language}.
        
        INSTRUCTIONS:
        1. ANALYZE the User Request.
           - If they ask to "Explain", generate 'mainContent' (Lesson).
           - If they ask for "Example", "Quiz", "Practice", or "Problem", generate 'quiz'.
           - If they ask for BOTH (e.g. "Explain and give quiz"), generate BOTH.
           - If unclear, default to providing a Lesson ('mainContent') AND a small Quiz.
           
        2. CONTENT RULES:
           - 'mainContent' (Lesson): Clear, engaging explanation. If OutputType is 'video', write as a script.
           - 'quiz' (Practice): Can be 'mcq' OR 'problem' (Deep Problem Solving). 
             - Use 'problem' if user asks for "hard", "deep", "thinking", or "complex".
             - Use 'mcq' for standard checks.
        
        Generate ONLY a valid JSON object with this EXACT structure:
        {
           "mainContent": "The lesson text or video script (Optional if user only wants quiz)",
           "quiz": {
               "type": "mcq" | "problem",  // Select based on request
               "questions": [
                  // IF MCQ
                  {
                     "id": 1,
                     "question": "Question text...",
                     "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
                     "correctAnswer": "A",
                     "explanation": "Why..."
                  },
                  // IF PROBLEM
                  {
                     "id": 1,
                     "question": "Problem Scenario...",
                     "hint": "Subtle hint...",
                     "solution": "Detailed step-by-step solution...",
                     "keyTakeaway": "Core concept..."
                  }
               ]
           },
           "mermaidDiagram": "MERMAID_SYNTAX_HERE (Optional)",
           "learningObjectives": ["Objective 1", "Objective 2"],
           "estimatedMinutes": 10,
           "keyClaims": ["Fact 1", "Fact 2"],
           "sources": ["Citation 1"]
        }
        
        CONSTRAINTS:
        - If 'quiz' is generated, include EXACTLY ${qCount} questions.
        - MERMAID: Use 'graph TD'. English labels ONLY. NO special chars. NO formulas.
        - Return ONLY JSON.
        `;

        // Logic to try specific model, fall back to generic Llama3 if missing
        let draft;
        try {
            draft = await generateWithOllama(MODELS.TUTOR, tutorPrompt);
        } catch (e) {
            console.warn(`[Council] Primary Tutor (${MODELS.TUTOR}) failed, falling back to ${MODELS.FALLBACK}`);
            draft = await generateWithOllama(MODELS.FALLBACK, tutorPrompt);
        }

        // ---------------------------------------------------------
        // STEP 2: THE COUNCIL AGENT (Phi-4)
        // ---------------------------------------------------------
        console.log(`[Council] Auditing Content with ${MODELS.COUNCIL}...`);

        const councilPrompt = `
        You are the 'Audit Council' using the Phi-4 Mini Protocol. Review this content for safety and accuracy.

        Content: "${draft.mainContent || 'Quiz Only'}"
        Claims: ${JSON.stringify(draft.keyClaims || [])}

        Generate a JSON object with this EXACT structure:
        {
            "verdict": "APPROVED",
            "confidenceScore": 0.98,
            "safetyCheck": {
                "isSafe": true,
                "isEthical": true,
                "isCopyrightFree": true,
                "isPedagogicallyNeutral": true
            },
            "auditNotes": "Brief verification notes."
        }
        `;

        let audit;
        try {
            audit = await generateWithOllama(MODELS.COUNCIL, councilPrompt);
        } catch (e) {
            // Memory Fallback: If Phi-4 fails (likely OOM on 8GB VRAM with DeepSeek loaded), 
            // fallback to Llama3 which is smaller/faster or assumed loaded.
            console.warn(`[Council] Primary Auditor(${MODELS.COUNCIL}) failed (likely OOM), falling back to ${MODELS.FALLBACK} `);
            audit = await generateWithOllama(MODELS.FALLBACK, councilPrompt);
        }

        return {
            success: true,
            data: {
                tutor: draft,
                council: audit, // Contains confidenceScore
                sources: draft.sources || ["DeepSeek-R1 Internal Knowledge Base"]
            }
        };

    } catch (error) {
        console.error("[Council] Local Stack Error:", error);

        // Fallback to Smart Mock if Ollama isn't running
        return {
            success: false,
            error: "Ollama Connection Failed. Please ensure Ollama is running (`ollama run llama3`). DETAILS: " + (error as Error).message
        };
    }
}

// ------------------------------------------------------------------
// ACTION: Chat with Tutor (Follow-up)
// ------------------------------------------------------------------
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function chatWithTutor(history: ChatMessage[], question: string, topic: string) {
    console.log(`[Council] 💬 Chatting about: ${topic}`);

    const MODELS = {
        TUTOR: "deepseek-r1:8b",
        FALLBACK: "llama3"
    };

    // Construct Context Window
    const recentHistory = history.slice(-6);

    let prompt = `
    You are the 'Universal Teaching Agent' having a conversation about "${topic}".
    
    PREVIOUS CONTEXT:
    ${recentHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}
    
    USER'S NEW QUESTION: "${question}"
    
    INSTRUCTIONS:
    - Answer the question directly and concisely.
    - specific to the topic "${topic}".
    - Output ONLY the answer text. No JSON.
    `;

    try {
        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODELS.TUTOR,
                prompt: prompt,
                stream: false,
                options: { temperature: 0.7 }
            })
        });

        if (!response.ok) throw new Error("Ollama API Failed");

        const data = await response.json();
        /* 
           Reuse cleanJson to remove any potential markdown code blocks 
           that might confuse the simple text renderer, though usually 
           DeepSeek is good at following "Output ONLY text".
        */
        const answer = cleanJson(data.response);

        return { success: true, answer };

    } catch (e) {
        console.error("Chat Error:", e);
        return { success: false, error: "Failed to reply." };
    }
}
