# Astra Learn - The Universal AI Tutor 🧠✨

**Astra Learn** is a privacy-first, offline AI tutoring platform capable of teaching ANY subject. It uses a **multi-agent system** (DeepSeek R1 + Phi-4) to generate, visualize, and verify educational content in real-time, all running locally on your machine.

![Astra Learn Preview](public/preview.png)

## 🚀 Key Features

### 1. **Hybrid Learning Mode ("ChatGPT-Style")**
- **Unified Intelligence**: The AI intelligently detects your intent from a single prompt.
    - Ask *"Explain Quantum Physics"* → You get a **Detailed Lesson**.
    - Ask *"Quiz me on Quantum Physics"* → You get a **Practice Quiz**.
    - Ask *"Explain and Quiz me"* → You get **Both** instantly.

### 2. **Advanced Quiz System**
- **Deep Problem Solving**: Generates multi-step problems with hints and collapsed solutions.
- **Customizable**: Choose 5, 10, or 15 questions per session.
- **Output Types**:
    - **Interactive**: Text + Audio (TTS).
    - **Text Only**: Silent mode for quiet study.
    - **Video Script**: Generates a script for future video production.

### 3. **Dynamic Visualizations & Math**
- **Mermaid.js Diagrams**: Automatically generates flowcharts and diagrams for every topic.
- **LaTeX Math Support**: Mathematical formulas (e.g., Quadratic Formula) render beautifully using KaTeX.
    - Example: `\( x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \)`

### 4. **Hardware Optimized (8GB VRAM)**
- **Smart Model Selection**:
    - **Tutor**: `deepseek-r1:8b` (Primary reasoning engine).
    - **Council**: `phi4` (Quality assurance).
- **Auto-Fallback**: If `phi4` uses too much memory, the system automatically switches to `llama3` to prevent crashes.

### 5. **Pedagogical Integrity**
- **"Verified by Council"**: Every lesson is audited by a second AI agent.
- **Learning Objectives**: Clear goals listed for every session.
- **Sources & References**: AI provides citations for its claims.

---

## 🛠️ Installation & Setup

### Prerequisites
1. **Node.js**: v18 or higher.
2. **Ollama**: [Download here](https://ollama.com).

### 1. Install Dependencies
```bash
npm install
```

### 2. Install AI Models
Astra Learn relies on specific local LLMs. Run the setup script to download them:

**Windows:**
```bash
.\setup_models.bat
```

**Mac/Linux:**
```bash
chmod +x setup_models.sh
./setup_models.sh
```

*Note: This will download `deepseek-r1:8b`, `phi4`, and `llama3` (~10GB total).*

### 3. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Technical Architecture

- **Frontend**: Next.js 16 (React, Tailwind, Lucide, Framer Motion)
- **AI Core**: Ollama (Local Inference)
- **Math Rendering**: KaTeX + React-Latex-Next
- **Visualization**: Mermaid.js
- **State Management**: React Hooks (Custom)

## 🏆 Hackathon Notes
- **Why no models in repo?** LLM files are too large (GBs). The `setup_models` script ensures you get the exact versions needed.
- **Offline Mode**: Once models are downloaded, you can disconnect the internet and the app works 100%.

## License
MIT
