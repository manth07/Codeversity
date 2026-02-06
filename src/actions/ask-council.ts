'use server';

// Input preferences
export interface SessionPreferences {
    topic: string;
    ageGroup: string;
    difficulty: string;
    learningStyle: string;
}

// ------------------------------------------------------------------
// HELPER: Clean JSON
// ------------------------------------------------------------------
function cleanJson(text: string) {
    // Remove markdown code blocks if present
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
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
        return JSON.parse(data.response);
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

        const tutorPrompt = `
        You are the 'Universal Teaching Agent'.
        Topic: "${preferences.topic}"
        Audience: ${preferences.ageGroup}
        Style: ${preferences.learningStyle}

        Generate a JSON object with this EXACT structure:
        {
           "mainContent": "A clear, engaging explanation...",
           "diagramPrompt": "A specialized prompt for an image generator describing a visual diagram of ${preferences.topic}. Use keywords like 'neon', 'minimal', 'educational'.",
           "videoScript": "A short narrator script (approx 4 sentences) explaining the key concept.",
           "keyClaims": ["Fact 1", "Fact 2", "Fact 3"]
        }
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
        
        Content: "${draft.mainContent}"
        Claims: ${JSON.stringify(draft.keyClaims)}

        Generate a JSON object with this EXACT structure:
        {
           "verdict": "APPROVED" (or "REVISED" / "FLAGGED"),
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
            console.warn(`[Council] Primary Auditor (${MODELS.COUNCIL}) failed, falling back to ${MODELS.FALLBACK}`);
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
