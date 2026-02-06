'use client';

// ------------------------------------------------------------------
// ASTRA LEARN: LUMINA EDITION (Local AI + Deep Space UI)
// ------------------------------------------------------------------

import { useState, useRef, useEffect } from 'react';
import { askCouncil, SessionPreferences } from '@/actions/ask-council';
import { Loader2 } from 'lucide-react';

export default function LuminaPage() {
  // ----------------------------------
  // STATE: CORE SESSION
  // ----------------------------------
  const [preferences, setPreferences] = useState<SessionPreferences>({
    topic: 'Explain the formation of the Indian summer monsoon',
    ageGroup: 'Grade 10',
    difficulty: 'Intermediate',
    learningStyle: 'Visual'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null); // Stores backend response

  // ----------------------------------
  // STATE: UI & MEDIA
  // ----------------------------------
  const [activeTab, setActiveTab] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [offlineMode, setOfflineMode] = useState(false);

  // UI Toggles
  const [showVideo, setShowVideo] = useState(true);
  const [showText, setShowText] = useState(true);
  const [showGraphic, setShowGraphic] = useState(true);
  const [showAudio, setShowAudio] = useState(true);

  // Audio/Video Playback Simulation State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(43);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(31);

  // ----------------------------------
  // LOGIC: BACKEND INTEGRATION
  // ----------------------------------
  const handleGenerate = async () => {
    if (!preferences.topic) return;
    setLoading(true);

    try {
      // Call Server Action (Ollama / Local AI)
      const response = await askCouncil('session-lumina-v1', preferences);

      if (response.success) {
        setResult(response.data);
        // Animate Confidence
        let conf = 0;
        const data: any = response.data;
        const targetScore = Math.round(data.council.confidenceScore * 100);
        const interval = setInterval(() => {
          conf += 2;
          if (conf >= targetScore) {
            setConfidence(targetScore);
            clearInterval(interval);
          } else {
            setConfidence(conf);
          }
        }, 20);
      } else {
        console.error("AI Error:", response.error);
        // Even on error, we might want to show something or alert the user
        // For now, simple alert
        alert(response.error || "Generation connection failed. Is Ollama running?");
      }
    } catch (e) {
      console.error("Transmission Failed", e);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // LOGIC: MEDIA HANDLERS
  // ----------------------------------
  const handleSpeak = () => {
    if (!result?.tutor?.videoScript) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const speech = new SpeechSynthesisUtterance(result.tutor.videoScript);
      speech.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(speech);
      setIsPlayingAudio(true);
    }
  };

  // ----------------------------------
  // RENDER
  // ----------------------------------
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9f6] font-sans text-slate-900">
      {/* ----------------------------------------------------
               SIDEBAR
            ---------------------------------------------------- */}
      <div className="w-60 bg-[#0f1724] text-white flex-shrink-0 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-x-3">
            <span className="inline-block h-px w-5 bg-emerald-400"></span>
            <span className="font-serif text-xs tracking-[0.065em] uppercase">lumina</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8">
          <ul className="space-y-1 px-3">
            {['Discover', 'My Paths', 'Library', 'History'].map((item, idx) => (
              <li key={item}>
                <button
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-2xl w-full text-left transition-colors ${activeTab === idx
                    ? 'bg-emerald-400 text-slate-900'
                    : 'hover:bg-slate-800 text-slate-300'
                    }`}
                >
                  {/* Simplified Icon Placeholder */}
                  <div className={`w-2 h-2 rounded-full ${activeTab === idx ? 'bg-slate-900' : 'bg-slate-500'}`} />
                  {item}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10 px-6">
            <p className="uppercase tracking-widest text-slate-500 text-[10px] mb-3 font-medium">Active Context</p>
            <div className="bg-slate-800/50 rounded-3xl p-1 text-xs space-y-1">
              <div className="bg-emerald-400 text-slate-900 rounded-2xl py-2 px-4 text-center font-semibold cursor-pointer truncate">
                {preferences.topic.substring(0, 20)}...
              </div>
            </div>
          </div>
        </nav>

        {/* Offline & Accessibility */}
        <div className="mt-auto border-t border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setOfflineMode(!offlineMode)}>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400">
              <span className={`inline-block h-px w-3 ${offlineMode ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              OFFLINE MODE
            </div>
            <div className={`relative w-9 h-5 rounded-full transition-colors ${offlineMode ? 'bg-emerald-500' : 'bg-slate-700'}`}>
              <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${offlineMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
          </div>

          <div className="h-px bg-slate-700 mb-4"></div>
          <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs">
            <div className="w-px h-3 bg-slate-400"></div>
            Local AI Node • Running
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
               MAIN CONTENT
            ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-full bg-[#f8f9f6]">
        {/* Top bar */}
        <header className="h-14 border-b bg-white flex items-center px-6 justify-between flex-shrink-0">
          <div className="flex items-center text-sm text-slate-400 gap-2">
            <span className="font-mono text-xs bg-slate-100 px-2 py-px rounded uppercase">{preferences.ageGroup} • {preferences.difficulty}</span>
            <span className="text-secondary">•</span>
            <span className="text-emerald-600 font-medium truncate max-w-md">{loading ? "Thinking..." : (result ? "Session Active" : "Ready")}</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              NEW QUERY
            </button>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-auto">
          {/* 1. HERO / PROMPT SECTION */}
          <section className="relative h-[380px] flex items-center justify-center bg-[#0f1724] overflow-hidden flex-shrink-0">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(#1e2937_1px,transparent_1px),linear-gradient(90deg,#1e2937_1px,transparent_1px)] bg-[size:32px_32px] opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1724] via-[#0f1724]/80 to-transparent"></div>

            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.065em] text-emerald-400 mb-3">
                <span className="h-px w-6 bg-emerald-400"></span> Powered by Local Intelligence
              </div>

              <h1 className="font-serif text-[4rem] md:text-[5.75rem] leading-[1.05] text-white tracking-[-0.01em] mb-4">
                What will<br />you understand<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300">today?</span>
              </h1>

              {/* Prompt Input */}
              <div className="relative max-w-2xl mx-auto mt-6">
                <div className={`bg-white rounded-3xl shadow-xl shadow-slate-900/30 flex items-center px-5 py-2 transition-all duration-300 ${loading ? 'opacity-80' : 'focus-within:ring-4 focus-within:ring-emerald-400'}`}>
                  <input
                    type="text"
                    className="bg-transparent flex-1 outline-none text-slate-700 placeholder:text-slate-400 text-base py-2"
                    value={preferences.topic}
                    onChange={(e) => setPreferences({ ...preferences, topic: e.target.value })}
                    placeholder="Ask anything..."
                    disabled={loading}
                  />

                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`transition-colors text-white text-sm font-semibold px-7 py-3 rounded-2xl flex-shrink-0 flex items-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Thinking</span>
                      </>
                    ) : (
                      <>
                        <span>Generate</span>
                        <span className="inline-block h-px w-3 bg-white/50"></span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 2. FILTERS */}
          <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
            <div className="max-w-screen-2xl mx-auto px-8 py-4 flex flex-wrap items-center gap-3 lg:gap-6 overflow-x-auto">

              {/* Domain (Static Decoration) */}
              <div>
                <span className="block text-[10px] font-mono text-slate-400 mb-px tracking-widest">DOMAIN</span>
                <div className="inline-flex border border-slate-200 rounded-2xl overflow-hidden text-xs font-medium">
                  <button className="px-5 py-1 bg-emerald-500 text-white">General</button>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <span className="block text-[10px] font-mono text-slate-400 mb-px tracking-widest">LEVEL</span>
                <div className="flex bg-slate-100 rounded-2xl p-px">
                  {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setPreferences({ ...preferences, difficulty: level })}
                      className={`text-xs px-4 py-px rounded-[13px] font-medium transition-colors ${preferences.difficulty === level ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience */}
              <div>
                <span className="block text-[10px] font-mono text-slate-400 mb-px tracking-widest">AUDIENCE</span>
                <select
                  className="bg-transparent border border-slate-200 text-xs rounded-xl py-1.5 pl-3 pr-8 text-slate-600 focus:outline-none"
                  value={preferences.ageGroup}
                  onChange={(e) => setPreferences({ ...preferences, ageGroup: e.target.value })}
                >
                  <option value="Grade 5">Kids (Grade 5)</option>
                  <option value="Grade 10">Teens (Grade 10)</option>
                  <option value="Undergrad">Uni Student</option>
                  <option value="PhD">Expert</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="ml-auto flex items-center gap-6 text-xs border-l pl-6 border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showText} onChange={() => setShowText(!showText)} className="accent-emerald-500" />
                  <span className="text-slate-500">Text</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showGraphic} onChange={() => setShowGraphic(!showGraphic)} className="accent-emerald-500" />
                  <span className="text-slate-500">Graphics</span>
                </label>
              </div>
            </div>
          </div>

          {/* 3. CONTENT WORKSPACE */}
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8 min-h-[600px]">
            {!result ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30 mt-20">
                <div className="w-16 h-16 border-2 border-slate-300 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-slate-400">?</span>
                </div>
                <p className="text-sm font-mono text-slate-400">Waiting for query transmission...</p>
              </div>
            ) : (
              <>
                {/* Result Header */}
                <div className="flex flex-wrap items-center justify-between mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div>
                    <div className="inline-flex items-center text-xs uppercase font-mono tracking-[0.065em] text-emerald-500 mb-px">
                      Generated Locally • {confidence}% confidence
                    </div>
                    <h2 className="font-serif text-[2.5rem] leading-tight tracking-[-0.006em] text-slate-900">
                      {preferences.topic}
                    </h2>
                    <p className="text-slate-500 text-sm italic">Verified by {result.council.verifierIdentity}</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl py-2 px-4 flex items-center gap-3 text-xs shadow-sm">
                    <span className="font-mono uppercase text-slate-400 text-[10px] tracking-widest">COUNCIL AUDIT</span>
                    <div className="relative w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full transition-all duration-1000 ${result.council.verdict === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                    <span className={`font-semibold tabular-nums ${result.council.verdict === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {result.council.verdict}
                    </span>
                  </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">

                  {/* COL 1: TEXT EXPLANATION */}
                  {showText && (
                    <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 h-fit animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                      <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-2 text-xs uppercase font-medium text-slate-500">
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-px rounded">Explanation</span>
                        </div>
                        <button onClick={handleSpeak} className="flex items-center text-emerald-600 hover:text-emerald-700 text-xs font-medium transition-colors">
                          {isPlayingAudio ? "Stop Reading" : "Read Aloud"}
                        </button>
                      </div>

                      <div className="p-7 max-h-[580px] overflow-auto leading-relaxed text-slate-700 text-[15px] whitespace-pre-wrap font-serif">
                        {result.tutor.mainContent}
                      </div>

                      <div className="bg-slate-50 px-6 py-3 text-[11px] flex items-center border-t">
                        <span className="font-mono text-slate-400">Source • Internal Knowledge Model (Llama 3)</span>
                      </div>
                    </div>
                  )}

                  {/* COL 2: SIDEBAR MEDIA */}
                  <div className="lg:col-span-5 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">

                    {/* Graphic Panel (Pollinations AI) */}
                    {showGraphic && (
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden group">
                        <div className="px-5 py-4 flex items-center justify-between border-b">
                          <span className="uppercase text-xs font-medium tracking-widest">Dynamic Diagram</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">LIVE RENDER</span>
                        </div>

                        <div className="relative aspect-square bg-[#f1f5f1] flex items-center justify-center overflow-hidden">
                          {/* Pollinations Image */}
                          <img
                            src={`https://image.pollinations.ai/prompt/${encodeURIComponent(result.tutor.diagramPrompt + " educational scientific diagram, clean vector style, white background, detailed, labeled")}`}
                            alt="Diagram"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>

                        <div className="px-5 py-3 border-t text-[11px] text-slate-500">
                          Prompt: {result.tutor.diagramPrompt}
                        </div>
                      </div>
                    )}

                    {/* Audio/Script Panel */}
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                      <div className="bg-emerald-500 px-5 py-3 text-xs text-white flex items-center justify-between">
                        <span className="font-medium flex items-center gap-2">
                          <span className="bg-white/20 text-[10px] px-1.5 py-px rounded">Voice Narration</span>
                        </span>
                      </div>

                      <div className="px-5 py-4">
                        <p className="text-xs text-slate-500 italic mb-4 line-clamp-3">
                          "{result.tutor.videoScript}"
                        </p>

                        <div className="flex items-center gap-4">
                          <button onClick={handleSpeak} className="text-emerald-600 bg-emerald-50 p-2 rounded-full hover:bg-emerald-100 transition-colors">
                            {isPlayingAudio ? (
                              // Pause Icon
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                              </svg>
                            ) : (
                              // Play Icon
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132z" />
                              </svg>
                            )}
                          </button>
                          <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full bg-emerald-400 ${isPlayingAudio ? 'animate-pulse w-2/3' : 'w-0'}`}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
