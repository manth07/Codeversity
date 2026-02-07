'use client';

import { useState, useEffect, useRef } from 'react';
import { askCouncil, chatWithTutor, SessionPreferences } from '@/actions/ask-council';
import MermaidRenderer from '@/components/visualizations/MermaidRenderer';
import AudioPlayer from '@/components/AudioPlayer';
import { ProfileSidebar } from '@/components/ProfileSidebar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { TopicCard } from '@/components/TopicCard';
import { EnhancedCard3D } from '@/components/EnhancedCard3D';
import { QuizDisplay } from '@/components/QuizDisplay';
import MathText from '@/components/MathText';
import { useLearningHistory, LearningTopic } from '@/hooks/useLearningHistory';
import { Loader2, Sparkles, BookOpen, Brain, Send, User, Bot, Clock, ShieldCheck, Target, Play } from 'lucide-react';

const topics = [
  { title: 'Understanding Quantum Mechanics', category: 'IT & Software', students: '9,530', rating: '4.8', color: 'pink' as const },
  { title: 'Powerful Business Writing: How to Write Concisely', category: 'Business', students: '1,463', rating: '4.9', color: 'peach' as const },
  { title: 'Video Production Masterclass', category: 'Media Training', students: '6,726', rating: '4.9', color: 'lavender' as const },
  { title: 'How to Design a Room in 10 Easy Steps', category: 'Interior', students: '8,735', rating: '5.0', color: 'mint' as const },
  { title: 'Machine Learning Fundamentals', category: 'IT & Software', students: '12,450', rating: '4.7', color: 'peach' as const },
  { title: 'The Art of Public Speaking', category: 'Business', students: '5,892', rating: '4.8', color: 'lavender' as const },
];

// Message Type definition
type Message = {
  role: 'user' | 'assistant';
  content: string; // For text
  type?: 'lesson' | 'chat' | 'quiz'; // Diff between full lesson, quiz, or simple chat
  data?: any; // For the initial rich lesson data (diagrams etc)
};

export default function HomePage() {
  const [preferences, setPreferences] = useState<SessionPreferences>({
    topic: '',
    ageGroup: 'Grade 10',
    difficulty: 'Intermediate',
    learningStyle: 'Visual',
    mode: 'explain',
    language: 'English',
    outputType: 'text_audio'
  });

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // Chat History
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const { addTopic } = useLearningHistory();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const generateContent = async () => {
    if (!preferences.topic.trim()) return;

    setLoading(true);
    setMessages([]); // Clear previous chat

    try {
      console.log(`%c[Astra] 🚀 Starting generation for: "${preferences.topic}"`, 'color: #10b981; font-weight: bold');

      console.log(`%c[Astra] 🚀 Starting generation for: "${preferences.topic}"`, 'color: #10b981; font-weight: bold');

      // Force Hybrid Mode for unified experience
      const response = await askCouncil('session-lumina-v1', {
        ...preferences,
        mode: 'hybrid' // Use the new unified backend logic
      });

      if (response.success && response.data) {
        console.log('%c[Astra] ✅ Generation complete!', 'color: #10b981; font-weight: bold');

        const newMsgs: Message[] = [];

        // 1. Add Lesson Content (if preserved)
        if (response.data.tutor.mainContent) {
          newMsgs.push({
            role: 'assistant',
            content: response.data.tutor.mainContent,
            type: 'lesson',
            data: response.data
          });
        }

        // 2. Add Quiz Content (if generated)
        if (response.data.tutor.quiz) {
          newMsgs.push({
            role: 'assistant',
            content: 'Here is a practice session based on the topic.',
            type: 'quiz', // New type
            data: response.data.tutor.quiz
          });
        }

        // Fallback: If neither, show error or generic
        if (newMsgs.length === 0) {
          newMsgs.push({
            role: 'assistant',
            content: "I'm sorry, I couldn't generate content for that topic.",
            type: 'chat'
          });
        }

        setMessages(newMsgs);

        // Save to history
        addTopic(
          preferences.topic,
          preferences.language || 'English',
          preferences.difficulty
        );
      } else {
        console.error("%c[Astra] ❌ Generation Error:", 'color: #ef4444; font-weight: bold', response.error);
        alert(response.error || "Generation failed. Is Ollama running?");
      }
    } catch (e) {
      console.error("%c[Astra] 🔥 Error:", 'color: #ef4444; font-weight: bold', e);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!input.trim() || chatLoading) return;

    const userMsg = input;
    setInput('');
    setChatLoading(true);

    // 1. Add User Message
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMsg }
    ];
    setMessages(newMessages);

    // 2. Call AI
    const apiHistory = newMessages.map(m => ({ role: m.role, content: m.content }));
    const res = await chatWithTutor(apiHistory, userMsg, preferences.topic);

    if (res.success) {
      setMessages(prev => [...prev, { role: 'assistant', content: res.answer || "I'd be happy to explain more.", type: 'chat' }]);
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I lost connection. Try again.", type: 'chat' }]);
    }
    setChatLoading(false);
  };

  const handleTopicSelect = (topicTitle: string) => {
    setPreferences({ ...preferences, topic: topicTitle });
    setTimeout(() => generateContent(), 100);
  };

  const handleHistorySelect = (item: LearningTopic) => {
    setPreferences({
      ...preferences,
      topic: item.topic,
      language: item.language,
      difficulty: item.difficulty,
    });
    setTimeout(() => generateContent(), 100);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3F0]">
      {/* Profile Sidebar - NOW ON LEFT */}
      <ProfileSidebar onTopicSelect={handleHistorySelect} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 pb-32"> {/* Added pb-32 for chat input space */}
          {messages.length === 0 && !loading ? (
            <>
              {/* Hero */}
              <div className="mb-8">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">
                  Learn anything<br />with AI
                </h1>
                <p className="text-xl text-gray-600">100% offline. Privacy-first. Powered by local AI.</p>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <CategoryFilter
                  activeCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {/* Popular Topics */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular topics</h2>
                <div className="grid grid-cols-2 gap-4">
                  {topics
                    .filter(topic => {
                      if (selectedCategory === 'all') return true;
                      const categoryMap: Record<string, string> = {
                        'it': 'IT & Software',
                        'media': 'Media Training',
                        'business': 'Business',
                        'interior': 'Interior'
                      };
                      return topic.category === categoryMap[selectedCategory];
                    })
                    .map((topic, idx) => (
                      <TopicCard
                        key={idx}
                        {...topic}
                        onClick={() => handleTopicSelect(topic.title)}
                      />
                    ))
                  }
                </div>
              </div>

              {/* Mode Toggle & Settings */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex bg-white/60 backdrop-blur-lg rounded-xl p-1 shadow-lg border border-gray-200">
                    <button
                      onClick={() => setPreferences({ ...preferences, mode: 'explain' })}
                      className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${preferences.mode === 'explain'
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      Explain
                    </button>
                    <button
                      onClick={() => setPreferences({ ...preferences, mode: 'practice' })}
                      className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${preferences.mode === 'practice'
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      <Brain className="w-4 h-4" />
                      Practice
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${showSettings ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Sparkles className="w-4 h-4" />
                  Customize Session
                </button>
              </div>

              {/* Customization Panel */}
              {showSettings && (
                <div className="mb-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm animate-fade-in-up">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Difficulty */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Difficulty</label>
                      <select
                        value={preferences.difficulty}
                        onChange={(e) => setPreferences({ ...preferences, difficulty: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert (Ph.D)</option>
                      </select>
                    </div>

                    {/* Age Group */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Target Audience</label>
                      <select
                        value={preferences.ageGroup}
                        onChange={(e) => setPreferences({ ...preferences, ageGroup: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      >
                        <option value="Child (5-10)">Child (5-10)</option>
                        <option value="Teen (13-18)">Teen (13-18)</option>
                        <option value="University Student">University Student</option>
                        <option value="Professional">Professional</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      >
                        {['English', 'Spanish', 'French', 'German', 'Hindi', 'Japanese', 'Mandarin', 'Arabic'].map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>

                    {/* Output / Quiz Config */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {preferences.mode === 'practice' ? 'Question Style' : 'Output Format'}
                      </label>
                      {preferences.mode === 'practice' ? (
                        <select
                          value={preferences.questionType || 'mixed'}
                          onChange={(e) => setPreferences({ ...preferences, questionType: e.target.value as any })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          <option value="mixed">Mixed (Standard)</option>
                          <option value="conceptual">Conceptual</option>
                          <option value="coding">Coding / Technical</option>
                          <option value="case_study">Case Study</option>
                          <option value="deep_problem">Deep Problem Solving (Hints + Solution)</option>
                        </select>
                      ) : (
                        <select
                          value={preferences.outputType || 'text_audio'}
                          onChange={(e) => setPreferences({ ...preferences, outputType: e.target.value as any })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          <option value="text_audio">Interactive (Text + Audio)</option>
                          <option value="text_only">Text Only</option>
                          <option value="video">Full Video (Beta)</option>
                        </select>
                      )}
                    </div>

                    {/* Question Count (Only for Practice) */}
                    {preferences.mode === 'practice' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Number of Questions</label>
                        <select
                          value={preferences.questionCount || 5}
                          onChange={(e) => setPreferences({ ...preferences, questionCount: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          <option value={5}>5 Questions (Quick)</option>
                          <option value={10}>10 Questions (Standard)</option>
                          <option value={15}>15 Questions (Deep Dive)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Topic Input */}
              <EnhancedCard3D className="bg-white/60 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Or learn anything you want</h3>
                </div>
                <input
                  type="text"
                  value={preferences.topic}
                  onChange={(e) => setPreferences({ ...preferences, topic: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && generateContent()}
                  placeholder="Type any topic... (e.g., 'Explain photosynthesis')"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-900 placeholder-gray-400"
                />
                <button
                  onClick={generateContent}
                  disabled={loading || !preferences.topic.trim()}
                  className="mt-4 w-full bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    'Start Learning'
                  )}
                </button>
              </EnhancedCard3D>
            </>
          ) : (
            /* =========================================================
               CHAT INTERFACE
               ========================================================= */
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between sticky top-0 bg-[#F5F3F0]/90 backdrop-blur-md z-10 py-4 border-b border-gray-200/50">
                <h1 className="text-2xl font-bold text-gray-900 truncate max-w-2xl">{preferences.topic}</h1>
                <button
                  onClick={() => setMessages([])}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  New Topic
                </button>
              </div>

              {/* Message List */}
              <div className="space-y-8">
                {loading && (
                  <div className="flex justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-r-transparent animate-spin"></div>
                      </div>
                      <p className="text-gray-500 animate-pulse">Consulting the Council...</p>
                    </div>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                    {/* Avatar for Assistant */}
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`max-w-3xl rounded-2xl p-6 ${msg.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-white shadow-sm border border-gray-100'
                      }`}>
                      {msg.type === 'lesson' && msg.data ? (
                        /* FULL LESSON RENDER */
                        <div className="space-y-6">
                          {/* Pedagogical Header (Visible in ALL Modes) */}
                          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-4">
                              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {preferences.difficulty} Level
                              </span>
                              <span className="flex items-center gap-2 text-gray-500 text-sm font-medium" title="Estimated Completion Time">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <span>Time: {msg.data.tutor.estimatedMinutes} mins</span>
                              </span>
                            </div>

                            {/* Verification Badge */}
                            {msg.data.council && (
                              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200" title={msg.data.council.auditNotes}>
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-xs font-bold">Verified ({Math.round(msg.data.council.confidenceScore * 100)}%)</span>
                              </div>
                            )}
                          </div>

                          {/* Main Content (Conditional Render for Video Mode) */}
                          {preferences.outputType === 'video' ? (
                            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl relative border border-gray-800 mb-6">
                              {/* Video Header */}
                              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                                  <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Video Script Mode</span>
                                </div>
                                <Play className="w-4 h-4 text-gray-400" />
                              </div>

                              {/* Script Content */}
                              <div className="p-8 prose prose-invert prose-lg max-w-none font-mono leading-loose text-gray-100/90">
                                <MathText content={msg.data.tutor.mainContent} />
                              </div>

                              {/* Delay Hint */}
                              <div className="absolute bottom-4 right-4 text-[10px] text-gray-600 font-mono">
                                Astra AI Video Engine v1.0
                              </div>
                            </div>
                          ) : (
                            <div className="prose prose-lg max-w-none mb-6">
                              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif">
                                <MathText content={msg.data.tutor.mainContent} />
                              </div>
                            </div>
                          )}

                          {/* Learning Objectives (Pedagogical Design) */}
                          {msg.data.tutor.learningObjectives && (
                            <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                              <div className="flex items-center gap-2 mb-3">
                                <Target className="w-5 h-5 text-blue-600" />
                                <h3 className="text-blue-900 font-bold text-base">Learning Objectives</h3>
                              </div>
                              <ul className="grid grid-cols-1 gap-3">
                                {msg.data.tutor.learningObjectives.map((obj: string, i: number) => (
                                  <li key={i} className="flex items-start gap-3 text-blue-800 text-sm leading-relaxed">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 shadow-sm" />
                                    {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Sources / Citations */}
                          {msg.data.sources && (
                            <div className="mt-2 pt-4 border-t border-gray-100">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sources & References</p>
                              <div className="flex flex-wrap gap-2">
                                {msg.data.sources.map((src: string, i: number) => (
                                  <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                                    {src}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Diagram */}
                          {msg.data.tutor.mermaidDiagram && (
                            <div className="my-4">
                              <MermaidRenderer
                                diagram={msg.data.tutor.mermaidDiagram}
                                topic={preferences.topic}
                              />
                            </div>
                          )}

                          {/* Audio */}
                          {preferences.outputType !== 'text_only' && (
                            <AudioPlayer
                              text={msg.data.tutor.mainContent}
                              topic={preferences.topic}
                              language={preferences.language}
                            />
                          )}

                          {/* Practice Mode Quiz */}
                          {preferences.mode === 'practice' && msg.data.tutor.questions && (
                            <QuizDisplay
                              questions={msg.data.tutor.questions}
                              topic={preferences.topic}
                              onRetry={() => generateContent()}
                              onNewTopic={() => setMessages([])}
                            />
                          )}
                        </div>
                      ) : msg.type === 'quiz' ? (
                        /* QUIZ RENDER */
                        <div className="w-full">
                          <QuizDisplay
                            questions={msg.data.questions}
                            topic={preferences.topic}
                            onRetry={() => { }}
                            onNewTopic={() => setMessages([])}
                          />
                        </div>
                      ) : (
                        /* STANDARD CHAT RENDER */
                        <div className="prose prose-lg max-w-none">
                          <div className="text-gray-800 leading-relaxed font-serif whitespace-pre-wrap">
                            <MathText content={msg.content} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Avatar for User */}
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {chatLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#F5F3F0] via-[#F5F3F0] to-transparent z-20">
                <div className="max-w-3xl mx-auto flex items-center gap-2 pl-[280px]"> {/* Offset for sidebar */}
                  <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-purple-400 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                      placeholder="Ask a follow-up question..."
                      disabled={chatLoading}
                      className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
                    />
                    <button
                      onClick={handleChatSubmit}
                      disabled={!input.trim() || chatLoading}
                      className="p-2 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
