'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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

  const getBuildingDescription = (buildingName) => {
    // Convert buildingName to lowercase for case-insensitive matching
    const name = buildingName.toLowerCase();
    switch (name) {
      case 'chapel':
        return {
          title: 'Fisk Memorial Chapel',
          year: '1892',
          description: 'Fisk Memorial Chapel, built in 1892, stands as a profound symbol of faith and community at Fisk University. This historic Victorian Gothic structure was designed by New York architect William Bigelow and serves as the spiritual center of campus life. The chapel features stunning stained glass windows, intricate woodwork, and excellent acoustics that have hosted countless performances by the renowned Fisk Jubilee Singers.',
        };
      case 'cravath':
        return {
          title: 'Cravath Hall',
          year: '1889',
          description: "Cravath Hall, named after Fisk's first president Erastus Milo Cravath, is one of the university's most iconic buildings. Built in 1889, this Victorian Gothic structure originally served as a library and now houses administrative offices. The building is notable for its distinctive clock tower and architectural details that reflect the university's historic legacy. It stands as a testament to Fisk's commitment to academic excellence and leadership.",
        };
      case 'jubilee':
        return {
          title: 'Jubilee Hall',
          year: '1876',
          description: 'Jubilee Hall, completed in 1876, holds the distinction of being the first permanent building for African American higher education in the United States. This historic building was funded through the remarkable tours of the original Fisk Jubilee Singers. The Victorian Gothic structure features a distinctive tower and serves as a powerful symbol of African American achievement and perseverance. Today, it continues to function as a residence hall, maintaining its historic significance while serving modern needs.',
        };
      default:
        return null;
    }
  };

  const recognizeBuilding = async (imageData) => {
    setIsLoading(true);
    try {
      // Convert base64 image to blob
      const base64Data = imageData.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      
      const byteArray = new Uint8Array(byteArrays);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Create FormData and append image
      const formData = new FormData();
      formData.append('file', blob, 'captured-image.jpg');

      console.log('Sending request to API...');

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      console.log('Response received:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`Failed to analyze image: ${errorData}`);
      }

      const data = await response.json();
      const buildingDetails = getBuildingDescription(data.predicted_class);
      
      setRecognitionResult({
        buildingName: data.predicted_class,
        confidence: data.confidence,
        details: buildingDetails
      });
    } catch (error) {
      console.error('Recognition error:', error);
      setError('Failed to analyze image. Please try again.');
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Building Identified:
                </h3>
                <p className="text-green-700 dark:text-green-200 text-xl mt-2">
                  {recognitionResult.details?.title || capitalizeFirstLetter(recognitionResult.buildingName)}
                </p>
                {recognitionResult.confidence && (
                  <p className="mt-2 text-sm text-gray-600">
                    Confidence: {(recognitionResult.confidence * 100).toFixed(1)}%
                  </p>
                )}
              </div>

              {recognitionResult.details && (
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Historical Information
                    </h4>
                    <span className="text-sm text-gray-500">
                      Built in {recognitionResult.details.year}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {recognitionResult.details.description}
                  </p>
                </div>
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