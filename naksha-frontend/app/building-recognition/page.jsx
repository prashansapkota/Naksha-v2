"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CameraIcon, PhotoIcon, ArrowLeftIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function BuildingRecognitionPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [showUploadSection, setShowUploadSection] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleBackClick = () => {
    if (isAuthenticated) {
      router.push('/welcome');
    } else {
      router.push('/guest-dashboard');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
      setPrediction(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

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
      console.log('Prediction data:', data);
      setPrediction(data.predicted_class);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setError('');
    setPrediction(null);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 
              dark:hover:text-blue-400 transition-colors mb-8"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Building Recognition
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose how you'd like to identify a building
          </p>
        </div>

        {!showUploadSection ? (
          // Options Grid
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Camera Option */}
            <button
              onClick={() => router.push('/camera')}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 
                hover:shadow-xl transition-all duration-200 hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-center mb-6">
                <CameraIcon className="h-16 w-16 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
                Use Camera
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Take a photo of a building in real-time using your device's camera
              </p>
            </button>

            {/* Upload Option */}
            <button
              onClick={() => setShowUploadSection(true)}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 
                hover:shadow-xl transition-all duration-200 hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-center mb-6">
                <PhotoIcon className="h-16 w-16 text-green-500 group-hover:scale-110 transition-transform" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
                Upload Image
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Upload an existing photo from your device
              </p>
            </button>
          </div>
        ) : (
          // Upload Section
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              {!previewUrl ? (
                // Upload Zone
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12">
                  <div className="text-center">
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold 
                          text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 
                          focus-within:ring-offset-2 hover:text-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageSelect}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                // Image Preview and Result
                <div className="relative">
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="absolute top-2 right-2 bg-red-100 dark:bg-red-900 rounded-full p-2
                      hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </button>
                  <div className="relative h-64 w-full mb-4">
                    <Image
                      src={previewUrl}
                      alt="Selected building"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>

                  {prediction && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                        Building Identified:
                      </h3>
                      <p className="text-green-700 dark:text-green-200 text-xl mt-2">
                        {capitalizeFirstLetter(prediction)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 text-red-600 dark:text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowUploadSection(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 
                    dark:hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!selectedImage || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed
                    transition-colors"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Image'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 