# Astra Learn - The Universal AI Tutor

Astra Learn is a 100% offline, privacy-first, multi-lingual AI tutoring platform capable of teaching ANY subject. It uses a multi-agent system (DeepSeek R1 + Phi-4) to generate, visualize, and verify educational content in real-time.

![Astra Learn Demo](public/preview.png)

## 🚀 Key Features
- **True Domain Agnostic**: Teaches anything from Quantum Physics to History.
- **100% Offline**: Runs locally using Ollama. No internet required.
- **Multi-Language**: Supports 10+ languages (English, Hindi, Bengali, Arabic, etc.).
- **Dual-Agent Architecture**: 'Tutor' generates content, 'Council' verifies accuracy.
- **Dynamic Visuals**: AI-generated Mermaid.js diagrams for every topic.
- **Audio Narration**: TTS support for all languages.

## 🛠️ Prerequisites

1. **Node.js** (v18 or higher)
2. **Ollama**: [Download here](https://ollama.com)

## 📦 Setup & Installation (Judges Start Here!)

> **Quick Start for Judges:** 
> 1. Run `setup_models.bat` (Windows) or `./setup_models.sh` (Mac/Linux) to install AI models.
> 2. Run `npm run dev` to launch the app.
> 3. Go to http://localhost:3000 to verify functionality.

### 1. Install Dependencies
```bash
npm install
```

### 2. Install AI Models (Crucial Step!)
Astra Learn relies on specific local LLMs. Run the setup script to download them automatically:

**For Windows:**
Double-click `setup_models.bat` or run:
```bash
.\setup_models.bat
```

**For Mac/Linux:**
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

## 🏗️ Architecture
- **Frontend**: Next.js 16 (React, Tailwind, Lucide)
- **AI Core**: Ollama (Local Inference)
- **Visualization**: IP-Mermaid (Robust Diagramming)
- **Voice**: Web Speech API

## 🏆 Hackathon Notes
- **Why no models in repo?** LLM files are too large for GitHub (GBs). The setup script ensures you get the exact versions needed.
- **Offline Mode**: Once models are downloaded, you can disconnect the internet and the app works 100%.

License: MIT
