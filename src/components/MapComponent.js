import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Navigation, ZoomIn, ZoomOut, Info, MapPin, X } from 'lucide-react';
import googleMapsService from '../services/googleMapsService';

const MapComponent = ({ userLocation, recommendations, onLocationSelect, onRestaurantClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Initialize map using googleMapsService to ensure placesService is also initialized
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        // Use googleMapsService to initialize - this also initializes placesService
        const { map } = await googleMapsService.initializeMap(
          mapRef.current,
          {
            center: userLocation || { lat: 25.0330, lng: 121.5654 },
            zoom: 15,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: mapStyles
          }
        );

        mapInstanceRef.current = map;
        setIsMapReady(true);
        console.log('✅ Map and PlacesService initialized successfully');
      } catch (error) {
        console.error('Map initialization failed:', error);
      }
    };

    initMap();
  }, [userLocation]);

  // Clear all markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      if (marker) marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  // Create user location marker
  const createUserMarker = useCallback((location) => {
    if (!mapInstanceRef.current || !location) return null;

    const marker = new window.google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      title: 'Your location',
      zIndex: 1000
    });

    marker.setIcon({
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#F97316" fill-opacity="0.2"/>
          <circle cx="16" cy="16" r="8" fill="#F97316" fill-opacity="0.4"/>
          <circle cx="16" cy="16" r="5" fill="#F97316" stroke="white" stroke-width="2"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16)
    });

    return marker;
  }, []);

  // Create restaurant marker
  const createRestaurantMarker = useCallback((place) => {
    if (!mapInstanceRef.current) return null;

    // Get location from place
    let position = null;
    if (place.geometry && place.geometry.location) {
      const loc = place.geometry.location;
      if (typeof loc.lat === 'function') {
        position = { lat: loc.lat(), lng: loc.lng() };
      } else if (typeof loc.lat === 'number') {
        position = { lat: loc.lat, lng: loc.lng };
      }
    }

    if (!position) {
      console.warn('No valid position for:', place.name);
      return null;
    }

    const score = place.recommendationScore || place.finalScore || 0;
    let color = '#78716C'; // Gray for low score
    if (score >= 70) color = '#10B981'; // Green for high
    else if (score >= 50) color = '#F59E0B'; // Amber for medium

    const marker = new window.google.maps.Marker({
      position: position,
      map: mapInstanceRef.current,
      title: place.name,
      zIndex: 100
    });

    marker.setIcon({
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24c0-8.836-7.164-16-16-16z" fill="${color}"/>
          <circle cx="16" cy="14" r="7" fill="white"/>
          <text x="16" y="17" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="${color}">${Math.round(score)}</text>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 40),
      anchor: new window.google.maps.Point(16, 40)
    });

    marker.addListener('click', () => {
      console.log('🍽️ Restaurant clicked:', place.name);
      if (onLocationSelect) onLocationSelect(place);
      if (onRestaurantClick) onRestaurantClick(place);
    });

    return marker;
  }, [onLocationSelect, onRestaurantClick]);

  // Update markers when user location or recommendations change
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    console.log('📍 Updating markers...', {
      hasUserLocation: !!userLocation,
      recommendationsCount: recommendations?.length || 0
    });

    // Clear existing markers
    clearMarkers();

    const newMarkers = [];

    // Add user location marker
    if (userLocation) {
      mapInstanceRef.current.setCenter(userLocation);
      const userMarker = createUserMarker(userLocation);
      if (userMarker) {
        newMarkers.push(userMarker);
        console.log('✅ User marker created');
      }
    }

    // Add restaurant markers
    if (recommendations && recommendations.length > 0) {
      console.log('🍽️ Creating restaurant markers for', recommendations.length, 'places');
      
      recommendations.forEach((place, index) => {
        const marker = createRestaurantMarker(place);
        if (marker) {
          newMarkers.push(marker);
          console.log(`✅ Marker ${index + 1}:`, place.name);
        }
      });

      // Fit bounds to show all markers
      if (newMarkers.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        newMarkers.forEach(marker => {
          if (marker.getPosition()) {
            bounds.extend(marker.getPosition());
          }
        });
        mapInstanceRef.current.fitBounds(bounds, { padding: 60 });
      }
    }

    markersRef.current = newMarkers;
    console.log('📍 Total markers:', newMarkers.length);
  }, [isMapReady, userLocation, recommendations, clearMarkers, createUserMarker, createRestaurantMarker]);

  const handleCenterOnUser = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.panTo(userLocation);
      mapInstanceRef.current.setZoom(15);
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Loading State */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-100">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center animate-pulse">
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Map Controls - Top Right */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <button
          onClick={handleCenterOnUser}
          disabled={!userLocation}
          className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center active:scale-95 transition-transform disabled:opacity-40"
          title="My location"
        >
          <Navigation className="w-4 h-4 text-surface-600" />
        </button>
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center active:scale-95 transition-transform"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-surface-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center active:scale-95 transition-transform"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-surface-600" />
        </button>
      </div>

      {/* Results Count - Top Left */}
      {recommendations && recommendations.length > 0 && (
        <div className="absolute top-2 left-2">
          <div className="px-2.5 py-1 bg-white/95 rounded-lg shadow-md text-xs font-semibold text-surface-700 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
            {recommendations.length} places
          </div>
        </div>
      )}

      {/* Legend Toggle - Bottom Left */}
      <div className="absolute bottom-2 left-2 z-10">
        {showLegend ? (
          <div className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg max-w-[130px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-surface-600 uppercase tracking-wide">Score</span>
              <button onClick={() => setShowLegend(false)} className="p-0.5 hover:bg-surface-100 rounded">
                <X className="w-3 h-3 text-surface-400" />
              </button>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-accent-mint flex items-center justify-center">
                  <span className="text-[7px] font-bold text-white">70+</span>
                </div>
                <span className="text-[10px] text-surface-600">Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-white">50+</span>
                </div>
                <span className="text-[10px] text-surface-600">Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-surface-400 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-white">&lt;50</span>
                </div>
                <span className="text-[10px] text-surface-600">Fair</span>
              </div>
              <div className="flex items-center gap-2 pt-1.5 mt-1 border-t border-surface-100">
                <div className="w-4 h-4 rounded-full bg-brand-orange" />
                <span className="text-[10px] text-surface-600">You</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLegend(true)}
            className="w-8 h-8 bg-white/95 rounded-lg shadow-md flex items-center justify-center active:scale-95 transition-transform"
            title="Show legend"
          >
            <Info className="w-4 h-4 text-surface-600" />
          </button>
        )}
      </div>
    </div>
  );
};

// Clean map styles
const mapStyles = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#E0F2FE' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#FED7AA' }] },
  { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#FFFFFF' }] }
];

export default MapComponent;
