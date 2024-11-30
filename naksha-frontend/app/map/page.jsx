"use client";

import { useState } from 'react';
import { LoadScript, GoogleMap } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const FISK_CENTER = {
  lat: 36.1676,
  lng: -86.8031
};

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)'
};

const libraries = ["places"];

export default function MapPage() {
  const [map, setMap] = useState(null);
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  const onLoad = map => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  return (
    <div className="h-screen relative">
      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm h-16 flex items-center px-4">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
      </nav>

      {/* Map Container */}
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={FISK_CENTER}
          zoom={17}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            mapTypeId: 'satellite',
            tilt: 45,
            heading: 45,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
        />
      </LoadScript>
    </div>
  );
}