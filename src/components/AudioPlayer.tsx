'use client';

import { useState, useEffect } from 'react';

interface AudioPlayerProps {
    text: string;
    topic: string;
    autoPlay?: boolean;
    language?: string; // NEW: Selected language
}

// Map language names to language codes for Web Speech API
const languageCodeMap: Record<string, string> = {
    'English': 'en-US',
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'German': 'de-DE',
    'Hindi': 'hi-IN',
    'Bengali': 'bn-IN',
    'Chinese': 'zh-CN',
    'Japanese': 'ja-JP',
    'Arabic': 'ar-SA',
    'Portuguese': 'pt-BR'
};

export default function AudioPlayer({ text, topic, autoPlay = false, language = 'English' }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);

    const speak = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any ongoing speech

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // Get the target language code
            const targetLang = languageCodeMap[language] || 'en-US';

            // Check if voices are loaded, if not wait for them
            const setVoiceAndSpeak = () => {
                const voices = window.speechSynthesis.getVoices();

                // Try to find a voice for the target language
                const targetVoice = voices.find(voice => voice.lang.startsWith(targetLang.split('-')[0]));

                if (targetVoice) {
                    utterance.voice = targetVoice;
                    utterance.lang = targetVoice.lang;
                } else {
                    // Fallback to English if target language not available
                    console.warn(`Voice for ${language} (${targetLang}) not available, falling back to English`);
                    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
                    if (englishVoice) {
                        utterance.voice = englishVoice;
                        utterance.lang = englishVoice.lang;
                    } else {
                        utterance.lang = 'en-US';
                    }
                }

                utterance.onstart = () => setIsPlaying(true);
                utterance.onend = () => {
                    setIsPlaying(false);
                    setIsPaused(false);
                };
                utterance.onerror = (e) => {
                    console.warn('Speech synthesis issue - this may happen if the browser does not support the selected language voice.');
                    setIsPlaying(false);
                    setIsPaused(false);
                };

                window.speechSynthesis.speak(utterance);
                setIsPaused(false);
            };

            // Voices might not be loaded immediately
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                setVoiceAndSpeak();
            } else {
                // Wait for voices to load
                window.speechSynthesis.onvoiceschanged = () => {
                    setVoiceAndSpeak();
                };
            }
        }
    };

    const pause = () => {
        if (window.speechSynthesis.speaking && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const resume = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ctrl+Space to play/pause
            if (e.key === ' ' && e.ctrlKey) {
                e.preventDefault();
                if (!isPlaying) {
                    speak();
                } else if (isPaused) {
                    resume();
                } else {
                    pause();
                }
            }
            // Ctrl+S to stop
            if (e.key === 's' && e.ctrlKey) {
                e.preventDefault();
                stop();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isPlaying, isPaused]);

    // Auto-play if requested
    useEffect(() => {
        if (autoPlay && text) {
            speak();
        }
        return () => window.speechSynthesis.cancel();
    }, []);

    if (!text) return null;

    return (
        <div className="relative p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-2xl border border-purple-500/30 rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-purple-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                    Audio Narration
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                    {isPlaying ? (isPaused ? '⏸️ Paused' : '▶️ Playing') : '⏹️ Stopped'}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mb-4">
                {!isPlaying ? (
                    <button
                        onClick={speak}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/50"
                        aria-label="Play audio narration"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Play
                    </button>
                ) : isPaused ? (
                    <button
                        onClick={resume}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-lg transition-all"
                        aria-label="Resume audio narration"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Resume
                    </button>
                ) : (
                    <button
                        onClick={pause}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-lg transition-all"
                        aria-label="Pause audio narration"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                        Pause
                    </button>
                )}

                {isPlaying && (
                    <button
                        onClick={stop}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all"
                        aria-label="Stop audio narration"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 6h12v12H6z" />
                        </svg>
                        Stop
                    </button>
                )}

                <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="ml-auto px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm rounded-lg transition-all border border-white/10"
                    aria-label="Toggle transcript"
                >
                    📄 {showTranscript ? 'Hide' : 'Show'} Transcript
                </button>
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="text-xs text-slate-500 mb-3 font-mono">
                Shortcuts: <kbd className="px-2 py-0.5 bg-white/10 rounded">Ctrl+Space</kbd> Play/Pause · <kbd className="px-2 py-0.5 bg-white/10 rounded">Ctrl+S</kbd> Stop
            </div>

            {/* Transcript */}
            {showTranscript && (
                <div
                    className="mt-4 p-4 bg-black/30 rounded-lg text-sm text-slate-300 leading-relaxed border border-white/5"
                    role="region"
                    aria-label={`Transcript for ${topic}`}
                >
                    <div className="text-xs text-slate-500 mb-2 font-mono uppercase">Transcript</div>
                    {text}
                </div>
            )}
        </div>
    );
}
