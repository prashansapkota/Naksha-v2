"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AboutFiskPage() {
  const buildings = [
    {
      name: "Jubilee Hall",
      year: 1876,
      description: "The first permanent building for African American higher education in the United States",
      image: "/images/jubilee-hall.jpg"
    },
    {
      name: "Cravath Hall",
      year: 1889,
      description: "Named after Fisk's first president, Erastus Milo Cravath",
      image: "/images/cravath-hall.jpg"
    },
    // Add more buildings as needed
  ];

  const historyTimeline = [
    {
      year: 1866,
      event: "Fisk University Founded",
      description: "Established as the Fisk Free Colored School"
    },
    {
      year: 1871,
      event: "Fisk Jubilee Singers",
      description: "Original Jubilee Singers depart on first tour"
    },
    // Add more historical events
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Link 
            href="/welcome"
            className="inline-flex items-center text-white hover:text-amber-200 mb-8 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold mb-4">About Fisk University</h1>
          <p className="text-xl text-amber-100">
            A beacon of excellence in education since 1866
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Mission Statement */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Fisk University produces graduates from diverse backgrounds with the integrity and intellect 
            required for substantive contributions to society. Our curriculum is grounded in the liberal 
            arts, and our faculty and administrators emphasize the discovery and advancement of knowledge 
            through research in the natural and social sciences, business and the humanities.
          </p>
        </motion.section>

        {/* Historic Buildings */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Historic Buildings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {buildings.map((building, index) => (
              <motion.div
                key={building.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={building.image}
                    alt={building.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {building.name}
                  </h3>
                  <p className="text-amber-600 dark:text-amber-400 mb-4">
                    Established {building.year}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {building.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Historical Timeline */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Our History
          </h2>
          <div className="space-y-8">
            {historyTimeline.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-24 text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {event.year}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {event.event}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 