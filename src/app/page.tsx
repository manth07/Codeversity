'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { HeroVisual } from '@/components/landing/HeroVisual';
import { BentoGrid } from '@/components/landing/BentoGrid';
import { Testimonials } from '@/components/landing/Testimonials';
import { Spotlight } from '@/components/ui/Spotlight';
import { Sparkles, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';

// Fixed positions to avoid hydration mismatch
const floatingShapes = [
    { size: 80, color: 'bg-pink-200', delay: 0, duration: 20, top: '15%', left: '10%' },
    { size: 120, color: 'bg-lavender-200', delay: 2, duration: 25, top: '60%', left: '80%' },
    { size: 60, color: 'bg-peach-200', delay: 4, duration: 18, top: '80%', left: '20%' },
    { size: 100, color: 'bg-mint-200', delay: 1, duration: 22, top: '25%', left: '75%' },
    { size: 70, color: 'bg-pink-100', delay: 3, duration: 19, top: '50%', left: '5%' },
];

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden font-sans">
            <Navbar />

            {/* Spotlight Effect */}
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            {/* Grid Background */}
            <div className="h-full w-full absolute inset-0 z-0 bg-dot-white/[0.2] pointer-events-none flex items-center justify-center">
                {/* Radial gradient for the container to give a faded look */}
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full mb-8 shadow-2xl border border-white/20 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-purple-400 animate-sparkle" />
                            <span className="text-sm font-medium text-gray-200">Powered by Local AI • 100% Offline</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6 leading-tight animate-fade-in-up tracking-tight drop-shadow-2xl">
                            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 animate-gradient drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">Anything</span>
                            <br />Private & Offline.
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up-delay leading-relaxed">
                            Your personal AI tutor running entirely on your device.
                            DeepSeek R1 & Phi-4 work together to verify facts, generate quizzes, and visualize complex topics.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up-delay-2 justify-center lg:justify-start">
                            <Link href="/learn" className="w-full sm:w-auto group relative px-8 py-4 bg-black text-white rounded-2xl font-semibold text-lg shadow-xl shadow-purple-300/20 hover:shadow-2xl hover:shadow-purple-400/40 transition-all hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100 flex items-center justify-center gap-2">
                                Start Learning Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="https://github.com/manth07/astra-learn" target="_blank" className="w-full sm:w-auto px-8 py-4 bg-white/60 backdrop-blur-lg text-gray-900 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2">
                                <Github className="w-5 h-5" />
                                Star on GitHub
                            </Link>
                        </div>

                        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 justify-center lg:justify-start animate-fade-in-up-delay-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs overflow-hidden`}>
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p>Joined by 10,000+ local learners</p>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="hidden lg:block z-10 animate-fade-in-left">
                        <HeroVisual />
                    </div>
                </div>
            </section>



            {/* How It Works Steps */}
            <section id="how-it-works" className="relative px-6 py-20 z-10 border-y border-white/10 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { step: '01', title: 'Pick a Topic', desc: 'Type anything: "Quantum Physics", "French Revolution", or "Python Basics".' },
                            { step: '02', title: 'AI Research', desc: 'Your local AI agents research, verify, and structure the lesson instantly.' },
                            { step: '03', title: 'Interactive Learning', desc: 'Visual diagrams, audio narration, and quizzes help you master it.' },
                        ].map((item, idx) => (
                            <div key={idx} className="relative pl-8 border-l-2 border-purple-500/30">
                                <span className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-black flex items-center justify-center text-sm font-bold text-purple-400 border-2 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                    {item.step}
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="relative px-6 py-32 z-10">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">
                        Learners <span className="text-red-500 animate-pulse">❤️</span> Astra Learn
                    </h2>
                    <Testimonials />
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative px-6 py-20 z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden bg-gray-900 px-6 py-20 text-center shadow-2xl">
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                                Stop Depending on WiFi.
                                <br />Start Learning.
                            </h2>
                            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                                Download the models once, and learn forever. Any topic, any language, anywhere.
                            </p>
                            <Link href="/learn" className="px-12 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-2">
                                Launch App Now
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                            <p className="mt-6 text-sm text-gray-400">
                                Open Source & Free • No Data Collection • Local AI
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative px-6 py-12 bg-white/30 backdrop-blur-md border-t border-white/20 z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-sm">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Astra Learn</span>
                        </div>
                        <p className="text-gray-600 max-w-sm">
                            The universal AI tutor that respects your privacy. Built for the future of decentralized education.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-purple-600">Features</a></li>
                            <li><a href="#" className="hover:text-purple-600">How it Works</a></li>
                            <li><a href="#" className="hover:text-purple-600">Download Models</a></li>
                            <li><a href="#" className="hover:text-purple-600">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Community</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-purple-600">GitHub</a></li>
                            <li><a href="#" className="hover:text-purple-600">Discord</a></li>
                            <li><a href="#" className="hover:text-purple-600">Twitter</a></li>
                            <li><a href="#" className="hover:text-purple-600">License</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">© 2024 Astra Learn. Open Source (MIT).</p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-400 hover:text-gray-600"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-gray-600"><Github className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-gray-600"><Linkedin className="w-5 h-5" /></a>
                    </div>
                </div>
            </footer>

            <style jsx>{`
        @keyframes spotlight {
          0% {
            opacity: 0;
            transform: translate(-72%, -62%) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translate(-50%,-40%) scale(1);
          }
        }

        .animate-spotlight {
          animation: spotlight 2s ease .75s 1 forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes sparkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.1); }
          75% { transform: rotate(10deg) scale(1.1); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-left {
            animation: fade-in-left 1s ease-out 0.5s backwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-fade-in-up-delay {
          animation: fade-in-up 1s ease-out 0.2s backwards;
        }

        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 1s ease-out 0.4s backwards;
        }

        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 1s ease-out 0.6s backwards;
        }

        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        .drop-shadow-glow {
          filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.3));
        }

        @keyframes spotlight {
          0% {
            opacity: 0;
            transform: translate(-72%, -62%) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translate(-50%,-40%) scale(1);
          }
        }

        .animate-spotlight {
          animation: spotlight 2s ease .75s 1 forwards;
        }
      `}</style>
        </div>
    );
}
