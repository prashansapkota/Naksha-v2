"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';

const FISK_CENTER = {
  lat: 36.1676,
  lng: -86.8083
};

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
    <div className="min-h-screen relative">
      {/* Background Map */}
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0
          }}
          center={FISK_CENTER}
          zoom={17}
          options={{
            disableDefaultUI: true,
            mapTypeId: 'satellite',
            tilt: 45,
            heading: 45,
            gestureHandling: 'none'
          }}
        />
      </LoadScript>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white animate-fade-in">
            Welcome to Naksha
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 animate-fade-in-delay">
            Your AI-powered campus navigation assistant
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Maps</h3>
            <p className="text-gray-300">Navigate campus with real-time directions and building information</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer">
            <div className="text-green-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Building Recognition</h3>
            <p className="text-gray-300">Instantly identify buildings using AI-powered image recognition</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer">
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
            <h3 className="text-xl font-semibold text-white mb-2">About Fisk</h3>
            <p className="text-gray-300">Explore Fisk University's rich history, historic buildings, and cultural heritage</p>
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
            className="px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm font-medium"
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
