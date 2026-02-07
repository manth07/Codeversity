'use client';

// ------------------------------------------------------------------
// ASTRA LEARN: LUMINA EDITION (Local AI + Deep Space UI)
// ------------------------------------------------------------------

import { useState } from 'react';
import { askCouncil, SessionPreferences } from '@/actions/ask-council';
import GenericViz from '@/components/visualizations/GenericViz';
import MermaidRenderer from '@/components/visualizations/MermaidRenderer';
import ParticleBackground from '@/components/ParticleBackground';
import Card3D from '@/components/Card3D';
import AudioPlayer from '@/components/AudioPlayer';
import { Loader2 } from 'lucide-react';

export default function LuminaPage() {
  // ----------------------------------
  // STATE: CORE SESSION
  // ----------------------------------
  const [preferences, setPreferences] = useState<SessionPreferences>({
    topic: 'Explain the formation of the Indian summer monsoon',
    ageGroup: 'Grade 10',
    difficulty: 'Intermediate',
    learningStyle: 'Visual',
    mode: 'explain', // NEW: explain or practice
    language: 'English' // NEW: target language
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

  const [audioProgress, setAudioProgress] = useState(31);

  // ----------------------------------
  // LOGIC: BACKEND INTEGRATION
  // ----------------------------------
  const handleGenerate = async () => {
    if (!preferences.topic) return;
    setLoading(true);

    try {
      console.log(`%c[Astra] 🚀 Starting generation for: "${preferences.topic}"`, 'color: #10b981; font-weight: bold');
      console.log(`%c[Astra] ⚙️ Mode: ${preferences.mode} | Language: ${preferences.language}`, 'color: #3b82f6');

      const response = await askCouncil('session-lumina-v1', preferences); // Using 'session-lumina-v1' as in original code

      if (response.success) {
        console.log('%c[Astra] ✅ Generation complete!', 'color: #10b981; font-weight: bold');
        console.log(`%c[Astra] 🎯 Confidence Score: ${Math.round((response.data?.council?.confidenceScore || 0.95) * 100)}%`, 'color: #a855f7');
        console.log('%c[Astra] 📊 Response Structure:', 'color: #6366f1', response.data);

        setResult(response.data);
        const targetScore = Math.round((response.data?.council?.confidenceScore || 0.95) * 100);
        let conf = 0;
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
        console.error("%c[Astra] ❌ Generation Error:", 'color: #ef4444; font-weight: bold', response.error);
        alert(response.error || "Generation connection failed. Is Ollama running?");
      }
    } catch (e) {
      console.error("%c[Astra] 🔥 Transmission Failed:", 'color: #ef4444; font-weight: bold', e);
    } finally {
      setLoading(false);
    }
  };


  // ----------------------------------
  // HELPER: Generate Smart Media Prompts (Fallback)
  // ----------------------------------
  const generateMediaPrompts = (topic: string) => {
    const topicLower = topic.toLowerCase();

    // Hardcoded high-quality prompts for common topics
    const knownPrompts: Record<string, { diagram: string; video: string }> = {
      'black holes': {
        diagram: 'Glowing accretion disk warped spacetime event horizon minimal neon diagram',
        video: 'Swirling cosmic matter spiraling into dark gravitational singularity space'
      },
      'photosynthesis': {
        diagram: 'Neon chloroplast thylakoid membrane light energy conversion diagram illustration',
        video: 'Green leaf cells absorbing sunlight producing oxygen bubbles closeup'
      },
      'quantum physics': {
        diagram: 'Subatomic particles wave function probability cloud neon scientific diagram',
        video: 'Quantum particles tunneling through energy barrier visualization physics'
      },
      'dna': {
        diagram: 'Double helix DNA structure base pairs nucleotides neon diagram',
        video: 'DNA molecule unzipping replication process molecular animation biology'
      },
      'solar system': {
        diagram: 'Planets orbiting sun orbital paths scale neon space diagram',
        video: 'Planets rotating around glowing sun cosmic space animation'
      }
    };

    // Find exact or partial match
    for (const [key, prompts] of Object.entries(knownPrompts)) {
      if (topicLower.includes(key) || key.includes(topicLower)) {
        return prompts;
      }
    }

    // Generic fallback based on topic keywords
    return {
      diagram: `${topic} scientific educational diagram neon minimal illustration concept`,
      video: `${topic} cinematic visualization process animation educational closeup`
    };
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a0f1c] to-slate-950 font-sans text-slate-200 selection:bg-emerald-500/30">

      {/* PARTICLE BACKGROUND */}
      <ParticleBackground />

      {/* BACKGROUND AURORA */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>



      {/* ----------------------------------------------------
               MAIN CONTENT
            ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-full relative z-10">

        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-transparent">
          <div className="flex items-center gap-4">
            {result && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest">
                  {confidence}% Confidence
                </span>
                <span className="text-slate-500 text-sm hidden md:inline">|</span>
                <span className="text-slate-400 text-sm hidden md:inline font-medium">{preferences.difficulty}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setResult(null)}
            className="bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all text-white px-6 py-2 rounded-full text-sm font-medium border border-white/10 backdrop-blur-md"
          >
            New Path
          </button>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 pb-40">

          {!result ? (
            /* HERO / INPUT STATE */
            <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto text-center animate-in zoom-in-95 duration-500">
              <div className="mb-8 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-md rounded-full p-6 border border-white/10">
                  {loading ? (
                    <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full"></div>
                  )}
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight">
                What will you <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">master today?</span>
              </h1>

              <div className="w-full relative mt-8">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 pointer-events-none"></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center">
                  <input
                    type="text"
                    value={preferences.topic}
                    onChange={(e) => setPreferences({ ...preferences, topic: e.target.value })}
                    placeholder="Type a topic (e.g., Quantum Physics)..."
                    className="bg-transparent flex-1 px-6 py-4 text-lg text-white placeholder:text-slate-500 outline-none"
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Thinking...' : 'Start'}
                  </button>
                </div>
              </div>

              {/* Output Format Selection */}
              <div className="mt-6">
                <label className="block text-sm font-mono text-emerald-400 mb-3">OUTPUT FORMATS 📋</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowText(!showText)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${showText
                      ? 'bg-emerald-500 text-white border-2 border-emerald-400'
                      : 'bg-white/5 text-slate-400 border-2 border-white/10 hover:bg-white/10'
                      }`}
                  >
                    📝 Text {showText && '✓'}
                  </button>
                  <button
                    onClick={() => setShowGraphic(!showGraphic)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${showGraphic
                      ? 'bg-blue-500 text-white border-2 border-blue-400'
                      : 'bg-white/5 text-slate-400 border-2 border-white/10 hover:bg-white/10'
                      }`}
                  >
                    📊 Diagram {showGraphic && '✓'}
                  </button>
                  <button
                    onClick={() => setShowAudio(!showAudio)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${showAudio
                      ? 'bg-purple-500 text-white border-2 border-purple-400'
                      : 'bg-white/5 text-slate-400 border-2 border-white/10 hover:bg-white/10'
                      }`}
                  >
                    🔊 Audio {showAudio && '✓'}
                  </button>
                </div>
              </div>

              {/* Additional Preferences */}
              <div className="mt-6 w-full max-w-md">
                <label className="block text-sm font-mono text-emerald-400 mb-3">PREFERENCES ⚙️</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* LEFT COLUMN: Age Group & Difficulty */}
                  <div className="space-y-4">
                    {/* Age Group */}
                    <div>
                      <label className="block text-sm font-mono text-emerald-400 mb-2">AGE GROUP</label>
                      <select
                        value={preferences.ageGroup}
                        onChange={(e) => setPreferences({ ...preferences, ageGroup: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="Grade 1-5" className="bg-slate-900 text-white">Grade 1-5</option>
                        <option value="Grade 6-8" className="bg-slate-900 text-white">Grade 6-8</option>
                        <option value="Grade 9-10" className="bg-slate-900 text-white">Grade 9-10</option>
                        <option value="Grade 11-12" className="bg-slate-900 text-white">Grade 11-12</option>
                        <option value="Undergraduate" className="bg-slate-900 text-white">Undergraduate</option>
                        <option value="Graduate" className="bg-slate-900 text-white">Graduate</option>
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-mono text-emerald-400 mb-2">DIFFICULTY</label>
                      <select
                        value={preferences.difficulty}
                        onChange={(e) => setPreferences({ ...preferences, difficulty: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="Beginner" className="bg-slate-900 text-white">Beginner</option>
                        <option value="Intermediate" className="bg-slate-900 text-white">Intermediate</option>
                        <option value="Advanced" className="bg-slate-900 text-white">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Learning Style & Language */}
                  <div className="space-y-4">
                    {/* Learning Style */}
                    <div>
                      <label className="block text-sm font-mono text-emerald-400 mb-2">LEARNING STYLE</label>
                      <select
                        value={preferences.learningStyle}
                        onChange={(e) => setPreferences({ ...preferences, learningStyle: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="Visual" className="bg-slate-900 text-white">Visual</option>
                        <option value="Verbal" className="bg-slate-900 text-white">Verbal</option>
                        <option value="Kinesthetic" className="bg-slate-900 text-white">Kinesthetic</option>
                        <option value="Logical" className="bg-slate-900 text-white">Logical</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-mono text-emerald-400 mb-2">LANGUAGE 🌍</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="English" className="bg-slate-900 text-white">English</option>
                        <option value="Spanish" className="bg-slate-900 text-white">Español</option>
                        <option value="French" className="bg-slate-900 text-white">Français</option>
                        <option value="German" className="bg-slate-900 text-white">Deutsch</option>
                        <option value="Hindi" className="bg-slate-900 text-white">हिन्दी</option>
                        <option value="Bengali" className="bg-slate-900 text-white">বাংলা</option>
                        <option value="Chinese" className="bg-slate-900 text-white">中文</option>
                        <option value="Japanese" className="bg-slate-900 text-white">日本語</option>
                        <option value="Arabic" className="bg-slate-900 text-white">العربية</option>
                        <option value="Portuguese" className="bg-slate-900 text-white">Português</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPreferences({ ...preferences, mode: 'explain' })}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${preferences.mode === 'explain' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  📖 Learn
                </button>
                <button
                  onClick={() => setPreferences({ ...preferences, mode: 'practice' })}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${preferences.mode === 'practice' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  ✏️ Practice
                </button>
              </div>

              {/* Quick Chips */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {['Black Holes', 'Photosynthesis', 'Roman Empire', 'AI Networks'].map(topic => (
                  <button
                    key={topic}
                    onClick={() => setPreferences({ ...preferences, topic })}
                    className="px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-sm transition-all"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ) : result ? (
            /* ACTIVE RESULT STATE */
            <div className="grid lg:grid-cols-12 gap-6">
              {/* CONTENT COLUMN (Text) */}
              <div className="lg:col-span-7 space-y-6 animate-in slide-in-from-left duration-700">

                {showText && (
                  <Card3D className="relative p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl hover:shadow-emerald-900/20 transition-all duration-500 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>

                    {/* Header with Time Badge */}
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <h2 className="text-3xl font-serif bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent leading-tight flex-1">
                        {preferences.topic}
                      </h2>
                      {result.tutor.estimatedMinutes && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex-shrink-0">
                          <span className="text-lg">⏱️</span>
                          <span className="text-xs font-mono text-emerald-400">
                            {result.tutor.estimatedMinutes} min
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Learning Objectives */}
                    {result.tutor.learningObjectives && (
                      <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 relative z-10">
                        <h4 className="text-sm font-mono text-blue-400 mb-2 flex items-center gap-2">
                          <span>🎯</span>
                          LEARNING OBJECTIVES
                        </h4>
                        <ul className="space-y-1 text-sm text-slate-300">
                          {result.tutor.learningObjectives.map((obj: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Main Content or Problem Statement */}
                    <div className="space-y-4 text-slate-300 leading-relaxed text-base relative z-10">
                      {result.tutor.problemStatement ? (
                        <div>
                          <h3 className="text-lg font-semibold text-purple-400 mb-3">📝 Practice Problem</h3>
                          <p className="mb-4">{result.tutor.problemStatement}</p>

                          {/* Hints */}
                          {result.tutor.hints && (
                            <details className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                              <summary className="cursor-pointer text-yellow-400 font-medium">💡 Hints</summary>
                              <ul className="mt-2 space-y-1 text-sm">
                                {result.tutor.hints.map((hint: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-yellow-400">{i + 1}.</span>
                                    <span>{hint}</span>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          )}

                          {/* Solution */}
                          {result.tutor.solution && (
                            <details className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                              <summary className="cursor-pointer text-green-400 font-medium">✅ Solution</summary>
                              <div className="mt-2 text-sm whitespace-pre-wrap">
                                {result.tutor.solution}
                              </div>
                            </details>
                          )}
                        </div>
                      ) : (
                        result.tutor.mainContent
                      )}
                    </div>

                    <div className="absolute bottom-4 right-4 text-xs font-mono text-emerald-500/50 uppercase tracking-wider">VERIFIED KNOWLEDGE</div>
                  </Card3D>
                )}

                {/* KEY CLAIMS */}
                {showText && (
                  <Card3D className="relative p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl hover:shadow-cyan-900/20 transition-all duration-500 group">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
                    <h3 className="text-sm font-mono uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2 relative z-10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Key Claims
                    </h3>
                    <ul className="space-y-3 relative z-10">
                      {result.tutor.keyClaims.map((claim: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                          <span className="text-emerald-400 mt-1">▸</span>
                          <span>{claim}</span>
                        </li>
                      ))}
                    </ul>
                  </Card3D>
                )}

                {/* Audio Player */}
                {showAudio && result.tutor.mainContent && (
                  <AudioPlayer
                    text={result.tutor.mainContent}
                    topic={preferences.topic}
                    language={preferences.language || 'English'}
                    autoPlay={false}
                  />
                )}
              </div>

              {/* MEDIA COLUMN */}
              <div className="lg:col-span-5 space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-200">

                {/* DYNAMIC MERMAID VISUALIZATION */}
                {showGraphic && (
                  <Card3D className="h-[600px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl hover:shadow-purple-900/30 transition-all duration-500">
                    {result.tutor.mermaidDiagram ? (
                      <MermaidRenderer
                        diagram={result.tutor.mermaidDiagram}
                        topic={preferences.topic}
                      />
                    ) : (
                      <GenericViz topic={preferences.topic} />
                    )}
                  </Card3D>
                )}

              </div>
            </div>
          ) : null}
        </div>



      </div>
    </div>
  );
}
