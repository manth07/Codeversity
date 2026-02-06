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

    // Default to Llama3, but fall back gracefully if not found (handled by user installing it)
    const LOCAL_MODEL = "llama3";

    try {
        // ---------------------------------------------------------
        // STEP 1: THE TUTOR AGENT (Ollama)
        // ---------------------------------------------------------
        console.log(`[Council] Contacting Local Node (${LOCAL_MODEL})...`);

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

        const draft = await generateWithOllama(LOCAL_MODEL, tutorPrompt);

        // ---------------------------------------------------------
        // STEP 2: THE COUNCIL AGENT (Ollama)
        // ---------------------------------------------------------
        console.log("[Council] Auditing Content Locally...");

        const councilPrompt = `
        You are the 'Audit Council'. Review this content for safety and accuracy.
        
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
           "verifierIdentity": "Local_Ethics_Protocol"
        }
    `;

        const audit = await generateWithOllama(LOCAL_MODEL, councilPrompt);

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
