"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';

const FISK_CENTER = {
  lat: 36.1676,
  lng: -86.8031
};

// Updated campus locations array with new locations
const CAMPUS_LOCATIONS = [
  {
    id: 1,
    name: "Library/Fisk Shop",
    position: { lat: 36.16701401372869, lng: -86.80326404285009 },
    description: "Campus Library and University Shop"
  },
  {
    id: 2,
    name: "Cafeteria/AESP",
    position: { lat: 36.168125825094506, lng: -86.8039725196361 },
    description: "Student Dining Hall and Academic Excellence"
  },
  {
    id: 3,
    name: "Administration/Registrar",
    position: { lat: 36.16704044053054, lng: -86.8046716445933 },
    description: "Administration Building and Registrar Office"
  },
  {
    id: 4,
    name: "Student Accounts",
    position: { lat: 36.167663355957394, lng: -86.80511824427954 },
    description: "Student Accounts Office"
  },
  {
    id: 5,
    name: "DSO Office",
    position: { lat: 36.1687737043182, lng: -86.80279989161336 },
    description: "Dean of Students Office"
  },
  
  {
    id: 6,
    name: "Park Johnson",
    position: { lat: 36.16807296636391, lng: -86.80317105157353 },
    description: "Park Johnson Building"
  },
  {
    id: 7,
    name: "Career Center",
    position: { lat: 36.1664433176741, lng: -86.80295385082107 },
    description: "Career Development and Leadership Center"
  },
  {
    id: 8,
    name: "Jubilee Hall/Appelton",
    position: { lat: 36.16894450899668, lng: -86.80498527557467 },
    description: "Jubilee Hall and Appelton Room"
  }
];

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)'
};

const libraries = ["places", "directions", "geometry"];

export default function MapPage() {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCampusLocation, setSelectedCampusLocation] = useState(null);
  
  const directionsServiceRef = useRef(null);
  const distanceMatrixServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const router = useRouter();

  // Initialize services
  useEffect(() => {
    if (window.google && map) {
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      distanceMatrixServiceRef.current = new window.google.maps.DistanceMatrixService();
      placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    }
  }, [map]);

  // Get user's location with high accuracy
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(pos);
          map?.panTo(pos);
          searchNearbyPlaces(pos);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Error getting your location. Please enable location services.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, [map]);

  // Search nearby places
  const searchNearbyPlaces = useCallback((location) => {
    if (!placesServiceRef.current) return;

    const request = {
      location: location,
      radius: '1000',
      type: ['university']
    };

    placesServiceRef.current.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setNearbyPlaces(results);
      }
    });
  }, []);

  // Calculate route and get distance/duration
  const calculateRoute = useCallback(async (destination) => {
    if (!directionsServiceRef.current || !distanceMatrixServiceRef.current || !userLocation) return;

    try {
      // Get directions
      const directionsResult = await directionsServiceRef.current.route({
        origin: userLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true
      });

      setDirections(directionsResult);

      // Get distance and duration
      const matrixResult = await distanceMatrixServiceRef.current.getDistanceMatrix({
        origins: [userLocation],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.WALKING,
        unitSystem: window.google.maps.UnitSystem.METRIC
      });

      if (matrixResult.rows[0].elements[0].status === 'OK') {
        setDistance(matrixResult.rows[0].elements[0].distance.text);
        setDuration(matrixResult.rows[0].elements[0].duration.text);
      }
    } catch (error) {
      console.error("Route calculation error:", error);
      alert("Error calculating route");
    }
  }, [userLocation]);

  // Handle place selection
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    calculateRoute(place.geometry.location);
  };

  // Handle campus location selection
  const handleCampusLocationSelect = (location) => {
    setSelectedCampusLocation(location);
    if (userLocation) {
      calculateRoute(location.position);
    }
  };

  // Map load handler
  const onLoad = useCallback((map) => {
    setMap(map);
    getUserLocation();
  }, [getUserLocation]);

  return (
    <div className="h-screen relative">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm h-16 flex items-center justify-between px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="flex-1 max-w-xl mx-4">
          <input
            type="text"
            placeholder="Search for a location..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <button
          onClick={getUserLocation}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
        >
          <MapPinIcon className="h-5 w-5" />
        </button>
      </nav>

      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || FISK_CENTER}
          zoom={17}
          onLoad={onLoad}
          options={{
            mapTypeId: 'satellite',
            tilt: 45,
            heading: 45,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              }}
            />
          )}

          {/* Campus location markers */}
          {CAMPUS_LOCATIONS.map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              onClick={() => handleCampusLocationSelect(location)}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: "#FF0000",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
                scale: 1.5,
              }}
              label={{
                text: location.name,
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: "bold",
                className: "marker-label"
              }}
            />
          ))}

          {/* Campus location info window */}
          {selectedCampusLocation && (
            <InfoWindow
              position={selectedCampusLocation.position}
              onCloseClick={() => setSelectedCampusLocation(null)}
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-lg">{selectedCampusLocation.name}</h3>
                <p className="text-gray-600 mt-1">{selectedCampusLocation.description}</p>
                {distance && duration && (
                  <div className="text-sm text-gray-600 mt-2">
                    <p>Distance: {distance}</p>
                    <p>Walking time: {duration}</p>
                  </div>
                )}
                <button
                  onClick={() => calculateRoute(selectedCampusLocation.position)}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 w-full transition-colors"
                >
                  Get Directions
                </button>
              </div>
            </InfoWindow>
          )}

          {/* Directions renderer */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#2563eb",
                  strokeWeight: 5,
                  strokeOpacity: 0.8
                }
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {/* Distance and duration overlay */}
      {distance && duration && (
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg">
          <div className="text-sm">
            <p className="font-semibold">Distance: {distance}</p>
            <p className="font-semibold">Walking time: {duration}</p>
          </div>
        </div>
      )}

      {/* Add custom styles for marker labels */}
      <style jsx global>{`
        .marker-label {
          background-color: rgba(0, 0, 0, 0.7);
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: -30px;
        }
      `}</style>
    </div>
  );
}