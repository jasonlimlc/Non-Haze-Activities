import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RegionalPsiData, SingaporeRegion } from '../types/haze';
import { MapPin, Compass, Layers, Maximize2, Shield, Eye, EyeOff } from 'lucide-react';

interface SingaporeRegionalMapProps {
  selectedRegion: SingaporeRegion;
  allRegionsData: Record<SingaporeRegion, RegionalPsiData>;
  onSelectRegion: (region: SingaporeRegion) => void;
  userLocationName?: string;
  userCoordinates?: { lat: number; lng: number };
}

// Singapore 5 NEA Planning Regions Geospatial Polygons (lat, lng pairs)
const REGION_GEO_BOUNDARIES: Record<
  Exclude<SingaporeRegion, 'national'>,
  { name: string; center: [number, number]; coordinates: [number, number][] }
> = {
  north: {
    name: 'North Region',
    center: [1.418, 103.82],
    coordinates: [
      [1.470, 103.820],
      [1.460, 103.850],
      [1.440, 103.870],
      [1.390, 103.880],
      [1.370, 103.835],
      [1.385, 103.780],
      [1.420, 103.755],
      [1.455, 103.765],
      [1.470, 103.820],
    ],
  },
  central: {
    name: 'Central Region',
    center: [1.3048, 103.832],
    coordinates: [
      [1.370, 103.835],
      [1.350, 103.870],
      [1.310, 103.875],
      [1.275, 103.860],
      [1.275, 103.820],
      [1.305, 103.805],
      [1.345, 103.805],
      [1.370, 103.835],
    ],
  },
  south: {
    name: 'South Region',
    center: [1.258, 103.822],
    coordinates: [
      [1.275, 103.820],
      [1.275, 103.860],
      [1.240, 103.870],
      [1.220, 103.840],
      [1.230, 103.815],
      [1.255, 103.785],
      [1.275, 103.820],
    ],
  },
  east: {
    name: 'East Region',
    center: [1.3574, 103.94],
    coordinates: [
      [1.390, 103.880],
      [1.410, 103.920],
      [1.415, 103.985],
      [1.375, 104.040],
      [1.320, 103.985],
      [1.295, 103.900],
      [1.310, 103.875],
      [1.350, 103.870],
      [1.390, 103.880],
    ],
  },
  west: {
    name: 'West Region',
    center: [1.3418, 103.705],
    coordinates: [
      [1.420, 103.755],
      [1.385, 103.780],
      [1.370, 103.835],
      [1.345, 103.805],
      [1.305, 103.805],
      [1.275, 103.820],
      [1.255, 103.785],
      [1.280, 103.730],
      [1.260, 103.630],
      [1.320, 103.620],
      [1.370, 103.680],
      [1.420, 103.755],
    ],
  },
};

const getStatusColor = (psi: number): { base: string; border: string; label: string } => {
  if (psi <= 50) return { base: '#10b981', border: '#059669', label: 'Good' };
  if (psi <= 100) return { base: '#0ea5e9', border: '#0284c7', label: 'Moderate' };
  if (psi <= 200) return { base: '#f59e0b', border: '#d97706', label: 'Unhealthy' };
  if (psi <= 300) return { base: '#f97316', border: '#ea580c', label: 'Very Unhealthy' };
  return { base: '#e11d48', border: '#be123c', label: 'Hazardous' };
};

export const SingaporeRegionalMap: React.FC<SingaporeRegionalMapProps> = ({
  selectedRegion,
  allRegionsData,
  onSelectRegion,
  userLocationName,
  userCoordinates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [showHazeOverlay, setShowHazeOverlay] = useState<boolean>(true);
  const [mapStyle, setMapStyle] = useState<'osm' | 'voyager'>('osm');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: [1.3521, 103.8198],
      zoom: 11,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
    });

    // Add OpenStreetMap Tile Layer
    const tileUrl =
      mapStyle === 'voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tiles = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapRef.current = map;

    return () => {
      tiles.remove();
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
      userMarkerRef.current = null;
    };
  }, [mapStyle]);

  // Update Regional Boundaries, PSI Badges, and Hover/Click Handlers
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (showHazeOverlay) {
      // Render 5 NEA Singapore Regional Polygons
      (Object.keys(REGION_GEO_BOUNDARIES) as Array<Exclude<SingaporeRegion, 'national'>>).forEach(
        (regionKey) => {
          const regionInfo = REGION_GEO_BOUNDARIES[regionKey];
          const data = allRegionsData[regionKey];
          const psi = data?.psi24Hourly ?? 70;
          const isSelected = selectedRegion === regionKey;
          const color = getStatusColor(psi);

          const polygon = L.polygon(regionInfo.coordinates, {
            color: isSelected ? '#0f172a' : color.border,
            weight: isSelected ? 3.5 : 2,
            opacity: 0.9,
            fillColor: color.base,
            fillOpacity: isSelected ? 0.45 : 0.25,
            dashArray: isSelected ? undefined : '4, 4',
          });

          // Region click & hover
          polygon.on('click', () => {
            onSelectRegion(regionKey);
          });

          polygon.bindTooltip(
            `<div class="font-sans text-xs">
              <strong>${regionInfo.name}</strong><br/>
              24-Hr PSI: <span class="font-bold font-mono" style="color: ${color.border}">${psi}</span> (${data?.status || color.label})<br/>
              <span class="text-[10px] text-slate-500">Click to switch advisory focus</span>
            </div>`,
            { sticky: true, opacity: 0.95 }
          );

          polygon.addTo(layerGroup);

          // Add Regional Center PSI Pill Badge
          const badgeIcon = L.divIcon({
            className: 'custom-psi-badge',
            html: `
              <div style="
                transform: translate(-50%, -50%);
                background: ${isSelected ? '#0f172a' : '#ffffff'};
                color: ${isSelected ? '#ffffff' : '#0f172a'};
                border: 2px solid ${color.base};
                padding: 4px 8px;
                border-radius: 9999px;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
                font-family: system-ui, sans-serif;
                font-size: 11px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 5px;
                white-space: nowrap;
                cursor: pointer;
              ">
                <span style="
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: ${color.base};
                  display: inline-block;
                "></span>
                <span>${regionInfo.name.replace(' Region', '')}:</span>
                <span style="color: ${isSelected ? color.base : color.border}; font-family: monospace;">
                  ${psi}
                </span>
              </div>
            `,
            iconSize: [0, 0],
          });

          const centerMarker = L.marker(regionInfo.center, { icon: badgeIcon });
          centerMarker.on('click', () => onSelectRegion(regionKey));
          centerMarker.addTo(layerGroup);
        }
      );
    }

    // Render User Location Pin if available
    if (userCoordinates && typeof userCoordinates.lat === 'number' && typeof userCoordinates.lng === 'number') {
      const pinIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            transform: translate(-16px, -32px);
          ">
            <div style="
              position: absolute;
              inset: 0;
              border-radius: 50%;
              background: #ef4444;
              opacity: 0.4;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              background: #ef4444;
              border: 3px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 10px;
                height: 10px;
                background: #ffffff;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const userMarker = L.marker([userCoordinates.lat, userCoordinates.lng], {
        icon: pinIcon,
        zIndexOffset: 1000,
      });

      userMarker.bindPopup(
        `<div class="font-sans text-xs space-y-1">
          <div class="font-bold text-slate-900 flex items-center gap-1">
            📍 <span>${userLocationName || 'Selected Location'}</span>
          </div>
          <div class="text-[11px] text-slate-500">
            Coordinates: ${userCoordinates.lat.toFixed(4)}, ${userCoordinates.lng.toFixed(4)}
          </div>
          <div class="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            Assigned Region: ${selectedRegion.toUpperCase()} · PSI ${allRegionsData[selectedRegion]?.psi24Hourly ?? '--'}
          </div>
        </div>`
      );

      userMarker.addTo(layerGroup);
      userMarkerRef.current = userMarker;
    }
  }, [selectedRegion, allRegionsData, showHazeOverlay, userCoordinates, userLocationName, onSelectRegion]);

  // Pan to user location when user coordinates change
  useEffect(() => {
    if (mapRef.current && userCoordinates && typeof userCoordinates.lat === 'number') {
      mapRef.current.flyTo([userCoordinates.lat, userCoordinates.lng], 13, {
        duration: 1.2,
      });
      userMarkerRef.current?.openPopup();
    }
  }, [userCoordinates]);

  const handleResetView = () => {
    mapRef.current?.flyTo([1.3521, 103.8198], 11, { duration: 1 });
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 overflow-hidden select-none">
      {/* Map Header with OpenStreetMap Attribution & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">OpenStreetMap (OSM) · Live Singapore Air Quality</span>
          <span className="hidden md:inline text-slate-400">· Real-world street & landmark map</span>
        </div>

        {/* Map Interactive Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Haze Zone Color Overlay */}
          <button
            type="button"
            onClick={() => setShowHazeOverlay(!showHazeOverlay)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border transition-all ${
              showHazeOverlay
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle NEA Regional Boundaries"
          >
            {showHazeOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showHazeOverlay ? 'NEA Haze Zones: ON' : 'Haze Zones: OFF'}</span>
          </button>

          {/* Map Layer Style */}
          <button
            type="button"
            onClick={() => setMapStyle(mapStyle === 'osm' ? 'voyager' : 'osm')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
            title="Switch Map Tile Style"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{mapStyle === 'osm' ? 'OSM Standard' : 'OSM Clean'}</span>
          </button>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
            title="Reset to full Singapore island view"
          >
            <Maximize2 className="w-3 h-3 text-slate-400" />
            <span>Fit Island</span>
          </button>
        </div>
      </div>

      {/* Real-World OpenStreetMap Leaflet Container */}
      <div className="relative w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-slate-800 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>

      {/* Footer Status & Region Selector Strip */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            Active Region: <strong className="text-white">{allRegionsData[selectedRegion]?.displayName}</strong>
          </span>
          <span className="text-slate-400 font-mono">
            (24h PSI: {allRegionsData[selectedRegion]?.psi24Hourly ?? '--'})
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> 0-50 Good
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> 51-100 Mod
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 101-200 Unhealthy
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> 201+ Severe
          </span>
        </div>
      </div>
    </div>
  );
};
