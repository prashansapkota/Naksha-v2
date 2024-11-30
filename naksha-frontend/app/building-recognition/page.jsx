"use client";

import Link from 'next/link';
import { FaCamera, FaCloudUploadAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function BuildingRecognition() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <motion.div 
        className="container mx-auto px-4 py-8 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Building Recognition
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Identify campus buildings instantly using your camera or upload existing photos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants}>
            <Link href="/building-recognition/camera" 
              className="block group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                    <FaCamera className="w-10 h-10 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Take Photo</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Use your device's camera to capture and identify buildings in real-time
                  </p>
                  <span className="inline-flex items-center text-blue-500 font-medium group-hover:text-blue-600">
                    Open Camera
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/building-recognition/upload" 
              className="block group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
                    <FaCloudUploadAlt className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Upload Photo</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Upload existing photos from your device to identify buildings
                  </p>
                  <span className="inline-flex items-center text-green-500 font-medium group-hover:text-green-600">
                    Choose File
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Choose either method to start identifying campus buildings
          </p>
        </div>
      </motion.div>
    </div>
  );
} 