"use client";

import { useState } from 'react';
import { LoadScript, GoogleMap } from '@react-google-maps/api';

const FISK_CENTER = {
  lat: 36.1676,
  lng: -86.8031
};

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)' // Full height minus navbar
};

const libraries = ["places"];

export default function MapPage() {
  const [map, setMap] = useState(null);

  const onLoad = map => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  return (
    <div className="h-screen">
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
        >
          {/* Child components, markers, info windows, etc. */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}