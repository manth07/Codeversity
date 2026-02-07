'use server';

// Input preferences
export interface SessionPreferences {
    topic: string;
    ageGroup: string;
    difficulty: string;
    learningStyle: string;
    mode?: 'explain' | 'practice'; // NEW: Toggle between explanation and practice
    language?: string; // NEW: Target language for content
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
    // Look for mermaid diagram syntax patterns
    const lines = text.split('\n');
    const diagramLines: string[] = [];
    let inDiagram = false;

    for (const line of lines) {
        const trimmed = line.trim();

        // Start of diagram (graph TD, sequenceDiagram, etc.)
        if (trimmed.match(/^(graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap)/)) {
            inDiagram = true;
            diagramLines.push(trimmed);
            continue;
        }

        // If we're in a diagram and hit JSON syntax, stop
        if (inDiagram && (trimmed.includes('"keyClaims"') || trimmed.includes('"mainContent"') || trimmed.includes('"problemStatement"') || trimmed === '}')) {
            break;
        }

        // Continue adding diagram lines
        if (inDiagram && trimmed) {
            diagramLines.push(trimmed);
        }
    }

    let diagram = diagramLines.join('\n');

    // Sanitize special characters that break Mermaid
    diagram = diagram
        // CRITICAL: Remove newlines within node labels (they break Mermaid)
        .replace(/\[([^\]]*)\]/g, (match, label) => {
            // Replace newlines, tabs, and multiple spaces within labels
            const cleanLabel = label
                .replace(/\\n/g, ' ')  // Remove escaped newlines
                .replace(/\n/g, ' ')   // Remove actual newlines
                .replace(/\r/g, '')    // Remove carriage returns
                .replace(/\t/g, ' ')   // Replace tabs with spaces
                .replace(/\s+/g, ' ')  // Collapse multiple spaces
                .trim();
            return `[${cleanLabel}]`;
        })
        // Replace math symbols with text equivalents
        .replace(/√/g, 'sqrt')
        .replace(/²/g, '^2')
        .replace(/³/g, '^3')
        .replace(/÷/g, 'div')
        .replace(/×/g, 'times')
        .replace(/±/g, 'plus-minus')
        .replace(/≈/g, 'approx')
        .replace(/≠/g, 'not-equal')
        .replace(/≤/g, 'less-equal')
        .replace(/≥/g, 'greater-equal')
        .replace(/π/g, 'pi')
        .replace(/∞/g, 'infinity')
        .replace(/∑/g, 'sum')
        .replace(/∫/g, 'integral')
        // Replace problematic ASCII characters ONLY in special contexts
        // Be more conservative to avoid removing too much content
        .replace(/\^/g, '')  // Remove carets
        .replace(/_([a-zA-Z])/g, '$1')   // Remove underscores before letters only
        .replace(/\s+\/\s+/g, ' over ') // Replace division symbol with spaces around it
        // Remove other problematic Unicode
        .replace(/[^\x00-\x7F]/g, ''); // Remove remaining non-ASCII

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
                }
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
    console.log(`[Council] 🔴 PROCESSING ON LOCAL AI | Topic: ${preferences.topic}`);

    // "Astra Stack" Model Configuration (Optimized for 8GB VRAM)
    const MODELS = {
        TUTOR: "deepseek-r1:8b",     // Chain of Thought (Primary Driver)
        COUNCIL: "phi4",             // Logic & Safety (Small but smart)
        FALLBACK: "llama3"           // Reliable backup
    };

    try {
        // ---------------------------------------------------------
        // STEP 1: THE TUTOR AGENT (DeepSeek R1)
        // ---------------------------------------------------------
        // Note: We use DeepSeek for its "Reasoning" capabilities (Chain of Thought).
        console.log(`[Council] Contacting Tutor using ${MODELS.TUTOR}...`);

        const mode = preferences.mode || 'explain';
        const language = preferences.language || 'English';

        const tutorPrompt = mode === 'practice' ? `
        You are the 'Universal Teaching Agent' in PRACTICE MODE.
        Topic: "${preferences.topic}"
        Audience: ${preferences.ageGroup}
        Difficulty: ${preferences.difficulty}
        Language: Generate ALL content in ${language}

        Generate ONLY a valid JSON object with this EXACT structure (no extra text):
        {
           "problemStatement": "A challenging practice question or exercise about ${preferences.topic}",
           "hints": ["Helpful hint 1", "Helpful hint 2", "Helpful hint 3"],
           "solution": "Step-by-step solution with clear explanations for each step",
           "mermaidDiagram": "MERMAID_SYNTAX_HERE showing the solution process",
           "learningObjectives": ["What students will learn from this exercise", "Key skill developed"],
           "estimatedMinutes": 10,
           "keyClaims": ["Key concept 1", "Key concept 2"]
        }
        
        Replace MERMAID_SYNTAX_HERE with Mermaid syntax visualizing the concept.
        Use 'graph TD' for flowcharts or 'sequenceDiagram' for processes.
        
        CRITICAL MERMAID RULES:
        - ALL diagram node labels MUST be in ENGLISH ONLY (even if content is in ${language})
        - Keep node labels SIMPLE and DESCRIPTIVE
        - NO newlines, NO parentheses, NO special characters: / ^ _ ( ) = + *
        - SINGLE LINE labels only - NO multi-line text
        - Use simple English words
        - BAD: "Calculate sqrt(1 - v^2/c^2)" or "प्रकाश संश्लेषण" or "Low Pressure\n(India)"
        - GOOD: "Light absorption" or "Chemical process" or "Low Pressure Area"
        - Example: A[Start] --> B[Process step] --> C[Final result]
        
        CRITICAL: Return ONLY the JSON object.
    ` : `
        You are the 'Universal Teaching Agent' in EXPLANATION MODE.
        Topic: "${preferences.topic}"
        Audience: ${preferences.ageGroup}
        Style: ${preferences.learningStyle}
        Language: Generate ALL content in ${language}

        Generate ONLY a valid JSON object with this EXACT structure (no extra text):
        {
           "mainContent": "A clear, engaging explanation (3-4 sentences).",
           "mermaidDiagram": "MERMAID_SYNTAX_HERE",
           "learningObjectives": ["What students will understand after reading", "Key takeaway 2"],
           "estimatedMinutes": 5,
           "keyClaims": ["Specific fact 1", "Specific fact 2", "Specific fact 3"]
        }
        
        Replace MERMAID_SYNTAX_HERE with ONLY the Mermaid.js diagram syntax. Choose the appropriate diagram type:
        - Use 'graph TD' for processes, flows, cycles (e.g., photosynthesis, water cycle, mitosis)
        - Use 'sequenceDiagram' for step-by-step interactions
        - Use 'graph LR' for timelines, cause-effect chains
        
        EXAMPLE for 'Black Holes':
        graph TD
            A[Massive Star] -->|Gravitational Collapse| B[Singularity]
            B --> C[Event Horizon]
            C --> D[Accretion Disk]
            D -->|Matter Spirals| E[X-ray Emission]
        
        EXAMPLE for 'Photosynthesis':
        graph TD
            A[Sunlight] --> B[Chlorophyll]
            B --> C[Water Split]
            C --> D[Oxygen Released]
            C --> E[Electrons]
            E --> F[ATP Created]
            F --> G[Calvin Cycle]
            G --> H[Glucose]
        
        RULES:
        - ALL diagram node labels MUST be in ENGLISH ONLY (even if content is in ${language})
        - mermaidDiagram must contain ONLY Mermaid syntax, no JSON
        - Use clear, short English node labels
        - NO newlines, NO parentheses, NO special characters: / ^ _ ( ) = + *
        - SINGLE LINE labels only
        - Show logical flow with --> arrows
        - Use |label| on arrows for transitions
        - Keep 5-8 nodes maximum
        - Ensure valid Mermaid.js code
        - learningObjectives should be specific and actionable
        - estimatedMinutes should be realistic (3-15 minutes)
        
        CRITICAL: Return ONLY the JSON object.
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
        You are the 'Audit Council' using the Phi-4 Mini Protocol.Review this content for safety and accuracy.

            Content: "${draft.mainContent}"
        Claims: ${JSON.stringify(draft.keyClaims)}

        Generate a JSON object with this EXACT structure:
        {
            "verdict": "APPROVED"(or "REVISED" / "FLAGGED"),
                "confidenceScore": 0.98,
                    "safetyCheck": {
                "isSafe": true,
                    "isEthical": true,
                        "isCopyrightFree": true,
                            "isPedagogicallyNeutral": true
            },
            "auditNotes": "Brief verification notes.",
                "verifierIdentity": "Phi-4_Mini_Audit_Bot"
        }
        `;

        let audit;
        try {
            audit = await generateWithOllama(MODELS.COUNCIL, councilPrompt);
        } catch (e) {
            console.warn(`[Council] Primary Auditor(${MODELS.COUNCIL}) failed, falling back to ${MODELS.FALLBACK} `);
            audit = await generateWithOllama(MODELS.FALLBACK, councilPrompt);
        }

        return {
            success: true,
            data: {
                tutor: draft,
                council: audit
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
