import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import googleMapsService from '../services/googleMapsService';

const MapComponent = ({ userLocation, recommendations, onLocationSelect, onRestaurantClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const { map: mapInstance } = await googleMapsService.initializeMap(
          mapRef.current,
          {
            center: userLocation || { lat: 25.0330, lng: 121.5654 },
            zoom: 15
          }
        );
        setMap(mapInstance);
      } catch (error) {
        console.error('Map initialization failed:', error);
      }
    };

    if (mapRef.current) {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (map && userLocation) {
      googleMapsService.setMapCenter(userLocation);
      
      // Clear old markers
      markers.forEach(marker => marker.setMap(null));
      
      // Create user location marker
      const userMarker = googleMapsService.createMarker(
        userLocation,
        'Your location',
        map
      );
      
      if (userMarker) {
        userMarker.setIcon({
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24)
        });
      }

      setMarkers([userMarker]);
    }
  }, [map, userLocation]);

  useEffect(() => {
    if (map && recommendations && recommendations.length > 0) {
      console.log('Creating markers for recommendations:', recommendations.length);
      
      // Clear old recommendation markers
      markers.forEach(marker => {
        if (marker !== markers[0]) { // Keep user location marker
          marker.setMap(null);
        }
      });

      const newMarkers = [markers[0]]; // Keep user location marker

      recommendations.forEach((place, index) => {
        if (place.geometry && place.geometry.location) {
          console.log('Creating marker for:', place.name);
          
          const marker = googleMapsService.createMarker(
            place.geometry.location,
            place.name,
            map
          );

          if (marker) {
            // Set different colored markers based on recommendation score
            const score = place.recommendationScore || 0;
            let color = '#ef4444'; // Red - Low score
            if (score >= 70) color = '#22c55e'; // Green - High score
            else if (score >= 50) color = '#f59e0b'; // Yellow - Medium score

            marker.setIcon({
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(20, 20)
            });

            // Add click event immediately after marker creation
            marker.addListener('click', () => {
              console.log('Marker clicked:', place.name);
              if (onLocationSelect) {
                onLocationSelect(place);
              }
              // Trigger AI analysis
              if (onRestaurantClick) {
                onRestaurantClick(place);
              }
            });

            console.log('Marker created and click listener added for:', place.name);
            newMarkers.push(marker);
          } else {
            console.error('Failed to create marker for:', place.name);
          }
        }
      });

      setMarkers(newMarkers);
      console.log('Total markers created:', newMarkers.length);
    }
  }, [map, recommendations]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Map control buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => {
            if (map && userLocation) {
              map.panTo(userLocation);
              map.setZoom(15);
            }
          }}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Back to my location"
        >
          <Navigation className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <div className="text-sm font-bold text-gray-800">Recommendation Score</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg"></div>
            <span className="text-xs font-medium text-gray-700">High (70+)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg"></div>
            <span className="text-xs font-medium text-gray-700">Medium (50-69)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full shadow-lg"></div>
            <span className="text-xs font-medium text-gray-700">Low (&lt;50)</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-lg"></div>
            <span className="text-xs font-medium text-gray-700">Click for AI analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
