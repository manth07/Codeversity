'use client';

import { useState } from 'react';
import { EnhancedCard3D } from './EnhancedCard3D';
import { CheckCircle2, XCircle, Trophy, RotateCcw, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import MathText from './MathText';

interface QuizQuestion {
    id: number;
    type?: 'mcq' | 'problem';
    question: string;
    // MCQ Fields
    options?: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correctAnswer?: 'A' | 'B' | 'C' | 'D';
    // Problem Fields
    hint?: string;
    solution?: string;
    keyTakeaway?: string;

    explanation?: string; // Common
}

interface QuizDisplayProps {
    questions: QuizQuestion[];
    topic: string;
    onRetry: () => void;
    onNewTopic: () => void;
}

export function QuizDisplay({ questions, topic, onRetry, onNewTopic }: QuizDisplayProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    // Problem State
    const [showHint, setShowHint] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    const currentQuestion = questions[currentIndex];
    const isProblemMode = currentQuestion.type === 'problem' || !!currentQuestion.solution;
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswer = (option: 'A' | 'B' | 'C' | 'D') => {
        if (hasAnswered) return;

        setSelectedAnswer(option);
        setHasAnswered(true);

        if (option === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setHasAnswered(false);
            // Reset Problem State
            setShowHint(false);
            setShowSolution(false);
        } else {
            setShowResults(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setHasAnswered(false);
        setScore(0);
        setShowResults(false);
        setShowHint(false);
        setShowSolution(false);
    };

    const handleSelfRate = (success: boolean) => {
        if (success) setScore(score + 1);
        setHasAnswered(true);
        // Force show solution if they rate themselves
        setShowSolution(true);
    }

    // Results Screen
    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 60;

        return (
            <div className="max-w-2xl mx-auto">
                <EnhancedCard3D className="bg-white/60 backdrop-blur-lg p-12 text-center">
                    <Trophy className={`w-20 h-20 mx-auto mb-6 ${passed ? 'text-green-600' : 'text-yellow-600'}`} />

                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {isProblemMode ? 'Session Complete!' : 'Quiz Complete!'}
                    </h2>

                    <div className="text-6xl font-bold mb-4">
                        <span className={passed ? 'text-green-600' : 'text-yellow-600'}>
                            {score}/{questions.length}
                        </span>
                    </div>

                    <p className="text-2xl text-gray-600 mb-8">
                        {percentage}% - {passed ? 'Great job!' : 'Keep practicing!'}
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleRestart}
                            className="px-6 py-3 bg-white/60 backdrop-blur-lg text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Try Again
                        </button>
                        <button
                            onClick={onNewTopic}
                            className="px-6 py-3 bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            New Topic
                        </button>
                    </div>
                </EnhancedCard3D>
            </div>
        );
    }

    // Quiz Screen
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="bg-white/60 backdrop-blur-lg rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                        {isProblemMode ? 'Problem' : 'Question'} {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                        Score: {score}/{currentIndex + (hasAnswered ? 1 : 0)}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <EnhancedCard3D className="bg-white/60 backdrop-blur-lg p-8">
                <div className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
                    <MathText content={currentQuestion.question} />
                </div>

                {/* RENDER MODE SPLIT */}
                {isProblemMode ? (
                    /* ---------------- PROBLEM SOLVING MODE ---------------- */
                    <div className="space-y-6">
                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 transition-colors"
                            >
                                <Lightbulb className="w-4 h-4" />
                                {showHint ? 'Hide Hint' : 'Need a Hint?'}
                            </button>
                        </div>

                        {/* Hint Box */}
                        {showHint && currentQuestion.hint && (
                            <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg text-amber-800 italic animate-fade-in-down">
                                💡 <MathText content={currentQuestion.hint} />
                            </div>
                        )}

                        {/* Self Rating (If not answered) */}
                        {!hasAnswered && (
                            <div className="pt-6 border-t border-gray-200">
                                <p className="text-gray-600 mb-4 font-medium text-center">Did you solve it?</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleSelfRate(true)}
                                        className="py-3 px-4 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition-colors border border-green-200"
                                    >
                                        Yes, I got it!
                                    </button>
                                    <button
                                        onClick={() => handleSelfRate(false)}
                                        className="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors border border-gray-200"
                                    >
                                        I needed help
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Collapsed Solution (Accordion) */}
                        {hasAnswered && (
                            <div className="mt-4">
                                <button
                                    onClick={() => setShowSolution(!showSolution)}
                                    className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                    <span className="font-bold flex items-center gap-2">
                                        📝 Detailed Solution
                                    </span>
                                    {showSolution ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                </button>

                                {showSolution && (
                                    <div className="p-6 bg-white border-x border-b border-gray-200 rounded-b-xl shadow-inner text-gray-800 leading-relaxed whitespace-pre-wrap animate-fade-in-up">
                                        <MathText content={currentQuestion.solution || ''} />

                                        {currentQuestion.keyTakeaway && (
                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Key Takeaway</p>
                                                <div className="text-blue-600 font-medium">
                                                    <MathText content={currentQuestion.keyTakeaway} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    /* ---------------- MCQ MODE ---------------- */
                    <div className="space-y-3">
                        {currentQuestion.options && (['A', 'B', 'C', 'D'] as const).map((option) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrect = option === currentQuestion.correctAnswer;
                            const showCorrect = hasAnswered && isCorrect;
                            const showIncorrect = hasAnswered && isSelected && !isCorrect;

                            return (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    disabled={hasAnswered}
                                    className={`w-full text-left p-4 rounded-xl font-medium transition-all ${showCorrect
                                        ? 'bg-green-100 border-2 border-green-600 text-green-900'
                                        : showIncorrect
                                            ? 'bg-red-100 border-2 border-red-600 text-red-900'
                                            : isSelected
                                                ? 'bg-purple-100 border-2 border-purple-600 text-purple-900'
                                                : 'bg-white/60 border-2 border-gray-200 text-gray-900 hover:border-purple-300 hover:bg-purple-50'
                                        } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>
                                            <span className="font-bold mr-3">{option})</span>
                                            <MathText content={currentQuestion.options![option]} />
                                        </span>
                                        {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                                        {showIncorrect && <XCircle className="w-6 h-6 text-red-600" />}
                                    </div>
                                </button>
                            );
                        })}

                        {/* Explanation */}
                        {hasAnswered && (
                            <div className={`mt-6 p-4 border-l-4 rounded animate-fade-in-up ${selectedAnswer === currentQuestion.correctAnswer
                                ? 'bg-green-50 border-green-600'
                                : 'bg-red-50 border-red-600'
                                }`}>
                                <p className={`text-sm font-bold mb-1 ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-900' : 'text-red-900'
                                    }`}>
                                    {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
                                </p>
                                <div className={`text-sm ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    <MathText content={currentQuestion.explanation || ''} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Next Button */}
                {hasAnswered && (
                    <button
                        onClick={handleNext}
                        className="mt-6 w-full px-6 py-3 bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                    </button>
                )}
            </EnhancedCard3D>
        </div>
    );
}
