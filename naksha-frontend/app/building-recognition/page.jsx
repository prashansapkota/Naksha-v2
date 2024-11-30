"use client";

import Link from 'next/link';

export default function BuildingRecognition() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Building Recognition</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/building-recognition/upload" 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Upload Photo</h2>
          <p>Upload an existing photo from your device</p>
        </Link>
        
        <Link href="/building-recognition/camera" 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Take Photo</h2>
          <p>Use your camera to take a new photo</p>
        </Link>
      </div>
    </div>
  );
} 