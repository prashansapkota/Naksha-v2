"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';

export default function Home() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    setShowLoginForm(false);
    router.push('/welcome');
  };

  const handleSignupSuccess = () => {
    setShowSignupForm(false);
    router.push('/welcome');
  };

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950">
      {/* Minimal Background */}
      <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),_transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.16),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.10),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.12),_transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-10 dark:opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white animate-fade-in">
            Naksha
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-200 animate-fade-in-delay">
            Your AI-powered campus navigation assistant
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-white/70 dark:bg-white/10 backdrop-blur-md p-6 rounded-xl hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/40 dark:border-white/10">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Interactive Maps</h3>
            <p className="text-slate-600 dark:text-gray-300">Navigate campus with real-time directions and building information</p>
          </div>

          <div className="bg-white/70 dark:bg-white/10 backdrop-blur-md p-6 rounded-xl hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/40 dark:border-white/10">
            <div className="text-green-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Building Recognition</h3>
            <p className="text-slate-600 dark:text-gray-300">Instantly identify buildings using AI-powered image recognition</p>
          </div>

          <div className="bg-white/70 dark:bg-white/10 backdrop-blur-md p-6 rounded-xl hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/40 dark:border-white/10">
            <div className="text-amber-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">About Fisk</h3>
            <p className="text-slate-600 dark:text-gray-300">Explore Fisk University's rich history, historic buildings, and cultural heritage</p>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="space-x-4">
          <button
            onClick={() => setShowLoginForm(true)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Login
          </button>
          <button
            onClick={() => setShowSignupForm(true)}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push('/guest-dashboard')}
            className="px-8 py-3 bg-slate-900/80 text-white rounded-lg hover:bg-slate-900 transition-colors backdrop-blur-sm font-medium dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
          >
            Continue as Guest
          </button>
        </div>
      </div>

      {/* Modal Forms */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <LoginForm onSuccess={handleLoginSuccess} onClose={() => setShowLoginForm(false)} />
          </div>
        </div>
      )}

      {showSignupForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <SignupForm onSuccess={handleSignupSuccess} onClose={() => setShowSignupForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
