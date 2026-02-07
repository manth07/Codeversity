'use client';

import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/50 backdrop-blur-xl shadow-sm py-3 border-b border-white/10' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Astra Learn
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">How it Works</a>
                    <a href="#testimonials" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Stories</a>

                    <Link href="/learn" className="px-5 py-2.5 bg-white text-black rounded-xl font-medium text-sm shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 transition-all inline-block">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-6 shadow-xl md:hidden flex flex-col gap-4 animate-fade-in">
                    <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-200">Features</a>
                    <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-200">How it Works</a>
                    <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-200">Testimonials</a>
                    <Link href="/learn" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-white text-black rounded-xl font-medium mt-2 text-center block">
                        Launch App
                    </Link>
                </div>
            )}
        </nav>
    );
}
