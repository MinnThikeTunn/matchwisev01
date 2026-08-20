import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { UserProfile } from '../types';
import { getColorIdentity } from '../lib/colorSystem';
import { 
  Compass, 
  Layers, 
  Locate, 
  Maximize2, 
  Minimize2, 
  Plus, 
  Minus, 
  RotateCcw, 
  MapPin, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Navigation
} from 'lucide-react';

interface RealTimeOpenStreetMapProps {
  currentUser: UserProfile;
  candidates: UserProfile[];
  selectedCandidate: UserProfile | null;
  onSelectCandidate: (candidate: UserProfile) => void;
  onHoverCandidate?: (candidate: UserProfile | null) => void;
}

// Calculate Haversine distance in kilometers or miles
function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Preset hub cities for quick real-time navigation
const CITY_HUBS = [
  { name: 'Global View', lat: 25.0, lng: 10.0, zoom: 3 },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, zoom: 12 },
  { name: 'New York', lat: 40.7128, lng: -74.0060, zoom: 12 },
  { name: 'London', lat: 51.5074, lng: -0.1278, zoom: 12 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, zoom: 12 },
  { name: 'Zurich', lat: 47.3769, lng: 8.5417, zoom: 12 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, zoom: 12 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, zoom: 12 },
  { name: 'Seattle', lat: 47.6062, lng: -122.3321, zoom: 12 },
  { name: 'Austin', lat: 30.2672, lng: -97.7431, zoom: 12 },
  { name: 'Boston', lat: 42.3601, lng: -71.0589, zoom: 12 }
];

type TileLayerStyle = 'osm' | 'light' | 'humanitarian';

const TILE_PROVIDERS: Record<TileLayerStyle, { url: string; attribution: string; name: string }> = {
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
  },
  light: {
    name: 'CartoDB Positron Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>'
  },
  humanitarian: {
    name: 'Humanitarian OSM',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank" rel="noreferrer">HOT</a>'
  }
};

export const RealTimeOpenStreetMap: React.FC<RealTimeOpenStreetMapProps> = ({
  currentUser,
  candidates,
  selectedCandidate,
  onSelectCandidate,
  onHoverCandidate
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeTileStyle, setActiveTileStyle] = useState<TileLayerStyle>('light');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>(3);
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number }>({
    lat: currentUser.coordinates.lat || 37.7749,
    lng: currentUser.coordinates.lng || -122.4194
  });
  const [isLocating, setIsLocating] = useState(false);
  const [userCustomLocation, setUserCustomLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedHub, setSelectedHub] = useState<string>('Global View');

  const userColor = getColorIdentity(currentUser.id);
  const currentLat = userCustomLocation?.lat || currentUser.coordinates.lat || 37.7749;
  const currentLng = userCustomLocation?.lng || currentUser.coordinates.lng || -122.4194;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [25.0, 10.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: true
    });

    // Create Base Tile Layer
    const baseTile = L.tileLayer(TILE_PROVIDERS[activeTileStyle].url, {
      attribution: TILE_PROVIDERS[activeTileStyle].attribution,
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = baseTile;

    // Create Layer Groups
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Map Event Listeners
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      setCenterCoords({
        lat: Number(center.lat.toFixed(4)),
        lng: Number(center.lng.toFixed(4))
      });
    });

    mapInstanceRef.current = map;

    // Trigger map invalidation after layout
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTile = L.tileLayer(TILE_PROVIDERS[activeTileStyle].url, {
      attribution: TILE_PROVIDERS[activeTileStyle].attribution,
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [activeTileStyle]);

  // Render & Update Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Render Current User "You" Marker
    const userDivHtml = `
      <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
        <div class="absolute -inset-2.5 rounded-full bg-[#D97706]/20 animate-ping"></div>
        <div class="relative w-10 h-10 rounded-full bg-[#D97706] ring-4 ring-white shadow-xl flex items-center justify-center p-0.5 z-30">
          <img src="${currentUser.avatar}" alt="${currentUser.name}" class="w-full h-full rounded-full object-cover" />
          <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#059669] border-2 border-white"></span>
        </div>
        <div class="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-stone-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-md pointer-events-none">
          You (${userColor.primaryName})
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: userDivHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const userMarker = L.marker([currentLat, currentLng], { icon: userIcon })
      .addTo(markersGroup)
      .bindPopup(
        `<div class="p-2 text-stone-900 text-xs">
          <p class="font-bold text-sm">${currentUser.name} (You)</p>
          <p class="text-stone-500">${currentUser.title} • ${currentUser.location}</p>
          <div class="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-[#D97706]">
            <span class="w-2 h-2 rounded-full bg-[#D97706]"></span>
            ${userColor.harmonicTitle}
          </div>
        </div>`
      );

    userMarkerRef.current = userMarker;

    // Optional Pulse Range Circle around user (e.g. 500km radius)
    const rangeCircle = L.circle([currentLat, currentLng], {
      radius: 400000, // 400km in meters
      color: '#D97706',
      fillColor: '#D97706',
      fillOpacity: 0.05,
      weight: 1,
      dashArray: '4, 8'
    }).addTo(markersGroup);

    // 2. Render Candidate Markers
    candidates.forEach((candidate) => {
      const lat = candidate.coordinates.lat ?? (35 + Math.random() * 15);
      const lng = candidate.coordinates.lng ?? (-120 + Math.random() * 40);
      const candColor = getColorIdentity(candidate.id);
      const isSelected = selectedCandidate?.id === candidate.id;
      const distance = getHaversineDistanceKm(currentLat, currentLng, lat, lng);

      const candHtml = `
        <div class="relative group cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-125 z-40' : 'hover:scale-115 z-20'}" style="transform: translate(-50%, -50%);">
          <div class="w-9 h-9 rounded-full bg-white ring-3 shadow-lg flex items-center justify-center p-0.5" style="ring-color: ${candColor.primaryColor};">
            <img src="${candidate.avatar}" alt="${candidate.name}" class="w-full h-full rounded-full object-cover" />
            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style="background-color: ${candColor.primaryColor};"></span>
          </div>
          <div class="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-stone-900/90 backdrop-blur-xs text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-md pointer-events-none">
            ${candidate.name}
          </div>
        </div>
      `;

      const markerIcon = L.divIcon({
        className: `custom-candidate-marker-${candidate.id}`,
        html: candHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(markersGroup);

      // Popup content
      const popupHtml = `
        <div class="p-2 text-stone-900 text-xs min-w-[200px]">
          <div class="flex items-center justify-between pb-1 mb-1 border-b border-stone-100">
            <span class="font-bold text-sm text-stone-900">${candidate.name}</span>
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${candColor.primaryColor}"></span>
          </div>
          <p class="text-stone-500 text-[11px]">${candidate.title}</p>
          <p class="text-stone-400 text-[10px] mt-0.5 flex items-center gap-1">
            <span>📍 ${candidate.location}</span>
            <span>•</span>
            <span>${distance} km away</span>
          </p>
          <div class="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background-color: ${candColor.primaryColor}20; color: ${candColor.primaryColor};">
              ${candColor.primaryName}
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectCandidate(candidate);
      });

      marker.on('mouseover', () => {
        if (onHoverCandidate) onHoverCandidate(candidate);
      });

      marker.on('mouseout', () => {
        if (onHoverCandidate) onHoverCandidate(null);
      });
    });
  }, [candidates, currentUser, selectedCandidate, currentLat, currentLng, userColor]);

  // Smooth Fly-To when selectedCandidate changes externally
  useEffect(() => {
    if (!selectedCandidate || !mapInstanceRef.current) return;
    const lat = selectedCandidate.coordinates.lat;
    const lng = selectedCandidate.coordinates.lng;
    if (lat !== undefined && lng !== undefined) {
      mapInstanceRef.current.flyTo([lat, lng], 11, { duration: 1.5 });
    }
  }, [selectedCandidate]);

  // Locate User GPS Position via browser geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCustomLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 13, { duration: 1.5 });
        }
      },
      (error) => {
        console.warn('Geolocation error / permission denied:', error.message);
        setIsLocating(false);
        // Default to San Francisco
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([currentLat, currentLng], 12, { duration: 1.2 });
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Fly to preset city hub
  const handleSelectCityHub = (city: typeof CITY_HUBS[0]) => {
    setSelectedHub(city.name);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([city.lat, city.lng], city.zoom, { duration: 1.5 });
    }
  };

  // Reset to global overview
  const handleResetView = () => {
    setSelectedHub('Global View');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([25.0, 10.0], 3, { duration: 1.2 });
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-black/60 backdrop-blur-md' : 'h-[620px] rounded-2xl overflow-hidden border border-stone-300 shadow-md'}`}>
      <div className="relative w-full h-full bg-stone-100 rounded-2xl overflow-hidden">
        {/* Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Top-Left: Real-Time HUD Status & City Hub Quick Navigation */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[calc(100%-3rem)]">
          {/* Live OpenStreetMap Badge */}
          <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full border border-stone-200 shadow-md flex items-center gap-2 text-xs font-semibold text-stone-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">OpenStreetMap Live</span>
            <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
              Z{currentZoom} • {centerCoords.lat}°N, {centerCoords.lng}°E
            </span>
          </div>

          {/* Quick Hub Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedHub}
              onChange={(e) => {
                const target = CITY_HUBS.find(h => h.name === e.target.value);
                if (target) handleSelectCityHub(target);
              }}
              className="bg-white/95 backdrop-blur-xs text-xs font-bold text-stone-800 px-3 py-1.5 rounded-full border border-stone-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 cursor-pointer pr-7 appearance-none"
              id="map-city-hub-selector"
            >
              {CITY_HUBS.map(hub => (
                <option key={hub.name} value={hub.name}>
                  🌐 {hub.name}
                </option>
              ))}
            </select>
            <Navigation className="w-3 h-3 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Top-Right: Map Tools & Layer Switcher */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Layer Style Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="p-2.5 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-700 hover:text-stone-900 rounded-xl border border-stone-200 shadow-md transition-all"
              title="Change Map Style"
              id="map-layer-toggle-btn"
            >
              <Layers className="w-4 h-4" />
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                <p className="font-bold text-stone-800 px-2 py-1 border-b border-stone-100 text-[11px]">
                  Map Tile Source
                </p>
                {(Object.keys(TILE_PROVIDERS) as TileLayerStyle[]).map((styleKey) => (
                  <button
                    key={styleKey}
                    onClick={() => {
                      setActiveTileStyle(styleKey);
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      activeTileStyle === styleKey
                        ? 'bg-amber-50 text-[#D97706] font-bold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{TILE_PROVIDERS[styleKey].name}</span>
                    {activeTileStyle === styleKey && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Real-Time Geolocation "Locate Me" Button */}
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`p-2.5 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-700 hover:text-stone-900 rounded-xl border border-stone-200 shadow-md transition-all flex items-center gap-1.5 ${
              isLocating ? 'animate-pulse text-[#D97706]' : ''
            }`}
            title="Locate My Real-Time GPS"
            id="map-locate-me-btn"
          >
            <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin text-[#D97706]' : ''}`} />
          </button>

          {/* Reset Global View */}
          <button
            onClick={handleResetView}
            className="p-2.5 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-700 hover:text-stone-900 rounded-xl border border-stone-200 shadow-md transition-all"
            title="Reset to Global Overview"
            id="map-reset-view-btn"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              setTimeout(() => {
                mapInstanceRef.current?.invalidateSize();
              }, 100);
            }}
            className="p-2.5 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-700 hover:text-stone-900 rounded-xl border border-stone-200 shadow-md transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
            id="map-fullscreen-btn"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom-Right: Zoom Controls */}
        <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            className="p-2.5 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-700 hover:text-stone-900 rounded-xl border border-stone-200 shadow-md transition-all"
            title="Zoom In"
            id="map-zoom-in-btn"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-700 hover:text-stone-900 rounded-xl border border-stone-200 shadow-md transition-all"
            title="Zoom Out"
            id="map-zoom-out-btn"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom-Left: Live Proximity & Chromatic Density Bar */}
        <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full bg-white/95 backdrop-blur-xs border border-stone-200/90 rounded-2xl p-4 shadow-lg hidden sm:block">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
              <Compass className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Real-Time Proximity Matrix</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {candidates.length} Nodes Active
            </span>
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Live OpenStreetMap coordinates calculating real-time geodesic proximity between your {userColor.primaryName} frequency and global candidate nodes.
          </p>

          <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-stone-600 border-t border-stone-100 pt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              You ({currentUser.location})
            </span>
            <span className="text-[#D97706]">OSM Cartography v2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
