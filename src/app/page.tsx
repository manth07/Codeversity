'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BentoGrid, BentoGridItem } from '@/components/bento/bento-grid';
import { CouncilCard } from '@/components/bento/council-card';
import { askCouncil, SessionPreferences } from '@/actions/ask-council';
import { Loader2 } from 'lucide-react';

export default function ActiveSessionPage() {
  // Session State
  const [preferences, setPreferences] = useState<SessionPreferences>({
    topic: '',
    ageGroup: 'Grade 10',
    difficulty: 'Intermediate',
    learningStyle: 'Visual'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTransmit = async () => {
    if (!preferences.topic) return;
    setLoading(true);

    const response = await askCouncil('session-id-123', preferences);

    if (response.success) {
      setResult(response.data);
    } else {
      console.error(response.error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 pt-24 pb-32 max-w-7xl mx-auto flex flex-col gap-8">

      {/* Header / Input Section */}
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Universal Teaching Agent
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-cyan-100 to-indigo-200">
          AstraLearn
        </h1>

        {/* Input Form */}
        <div className="max-w-xl mx-auto flex flex-col gap-4 mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <input
            type="text"
            placeholder="What do you want to learn today?"
            className="w-full bg-transparent border-b border-white/20 p-2 text-xl outline-none focus:border-cyan-400 transition-colors placeholder:text-white/20"
            value={preferences.topic}
            onChange={(e) => setPreferences({ ...preferences, topic: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-2">
            <select
              className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white/70 outline-none"
              value={preferences.ageGroup}
              onChange={(e) => setPreferences({ ...preferences, ageGroup: e.target.value })}
            >
              <option>Grade 5</option>
              <option>Grade 8</option>
              <option>Grade 10</option>
              <option>Undergrad</option>
              <option>PhD</option>
            </select>
            <select
              className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white/70 outline-none"
              value={preferences.difficulty}
              onChange={(e) => setPreferences({ ...preferences, difficulty: e.target.value })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
            <select
              className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white/70 outline-none"
              value={preferences.learningStyle}
              onChange={(e) => setPreferences({ ...preferences, learningStyle: e.target.value })}
            >
              <option>Visual</option>
              <option>Socratic</option>
              <option>Text-Heavy</option>
            </select>
          </div>
        </div>
      </header>

      {/* Results Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-sm font-mono text-cyan-200/50">Consulting the Council...</p>
        </div>
      ) : result ? (
        <BentoGrid className="max-w-6xl mx-auto">
          {/* Main Explanation */}
          <BentoGridItem
            className="md:col-span-2 min-h-[300px]"
            title={preferences.topic} // Dynamic Topic
            description={result.tutor.mainContent.substring(0, 150) + "..."}
            header={<div className="p-6 text-sm text-white/80 leading-relaxed font-mono">{result.tutor.mainContent}</div>}
          />

          {/* Council Audit Card */}
          <BentoGridItem
            className="md:col-span-1"
            title="Council Audit"
            header={
              <CouncilCard
                verdict={result.council.verdict}
                confidence={result.council.confidenceScore}
                verifierName={result.council.verifierIdentity}
                notes={result.council.auditNotes}
              />
            }
          />

          {/* Multimodal: Video Script & TTS */}
          <BentoGridItem
            className="md:col-span-1"
            title="Video Script (Audio Mode)"
            header={
              <div className="h-full flex flex-col justify-between bg-white/5 p-4 rounded-xl border border-dashed border-white/10 group">
                <p className="text-xs font-mono text-white/50 line-clamp-6 italic">
                  "{result.tutor.videoScript}"
                </p>
                <button
                  onClick={() => {
                    const speech = new SpeechSynthesisUtterance(result.tutor.videoScript);
                    window.speechSynthesis.speak(speech);
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  ▶ Play Narration
                </button>
              </div>
            }
          />

          {/* Multimodal: Real-Time AI Generation */}
          <BentoGridItem
            className="md:col-span-2"
            title="Generative Diagram"
            header={
              <div className="relative h-full w-full min-h-[200px] bg-black rounded-xl overflow-hidden border border-white/10 group">
                {/* Free AI Image Generation via Pollinations.ai */}
                <img
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(result.tutor.diagramPrompt + " educational, minimal, neon style, dark background, 8k")}`}
                  alt="Generated Diagram"
                  className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  loading="lazy"
                />

                {/* Overlay Prompt Text */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4">
                  <div className="text-[10px] text-emerald-400 font-mono mb-1">// REAL-TIME_RENDER_COMPLETE</div>
                  <p className="text-xs text-white/60 line-clamp-1">{result.tutor.diagramPrompt}</p>
                </div>
              </div>
            }
          />
        </BentoGrid>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 opacity-50">
          <p className="text-sm font-mono text-white/30">Enter a topic to begin session.</p>
        </div>
      )}

      {/* Bottom Bar Input */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
          <div className="relative flex items-center bg-black/80 backdrop-blur-xl rounded-full border border-white/10 p-2 shadow-2xl">
            <span className="pl-4 text-xs font-mono text-cyan-400 hidden sm:block">
              ASTRA_TERMINAL_V1
            </span>
            <div className="flex-1 text-center text-sm text-white/50">
              {loading ? "PROCESSING..." : "READY FOR TRANSMISSION"}
            </div>
            <button
              onClick={handleTransmit}
              disabled={loading}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${loading ? 'bg-white/10 text-white/30' : 'bg-white text-black hover:scale-105'}`}
            >
              {loading ? 'Thinking...' : 'Transmit'}
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}
