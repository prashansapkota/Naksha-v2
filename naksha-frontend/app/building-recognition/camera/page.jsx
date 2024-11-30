'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CameraCapture() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Unable to access camera. Please ensure you've granted camera permissions.");
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setImageData(imageData);
      setCaptured(true);
      stopCamera();
      recognizeBuilding(imageData);
    }
  };

  const recognizeBuilding = async (imageData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/recognize-building', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to recognize building');
      }

      const data = await response.json();
      setRecognitionResult(data);
    } catch (error) {
      setError('Failed to recognize building. Please try again.');
      console.error('Error recognizing building:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const retake = () => {
    setCaptured(false);
    setImageData(null);
    setRecognitionResult(null);
    setError(null);
    startCamera();
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Building Recognition Camera</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!captured ? (
        <div className="space-y-4">
          <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-center gap-4">
            {!stream ? (
              <button
                onClick={startCamera}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Camera
              </button>
            ) : (
              <button
                onClick={captureImage}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Capture Photo
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={imageData}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2">Analyzing image...</p>
            </div>
          ) : recognitionResult && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Recognition Result:</h2>
              <p className="font-medium">{recognitionResult.buildingName}</p>
              <p className="mt-2 text-gray-700">{recognitionResult.description}</p>
              {recognitionResult.confidence && (
                <p className="mt-2 text-sm text-gray-600">
                  Confidence: {(recognitionResult.confidence * 100).toFixed(1)}%
                </p>
              )}
            </div>
          )}
          
          <div className="flex justify-center gap-4">
            <button
              onClick={retake}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Take Another Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 