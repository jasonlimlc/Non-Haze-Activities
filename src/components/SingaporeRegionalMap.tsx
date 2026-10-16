import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RegionalPsiData, SingaporeRegion } from '../types/haze';
import {
  MapPin,
  Layers,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Compass,
  Activity,
  Sparkles,
  Info,
} from 'lucide-react';

interface SingaporeRegionalMapProps {
  selectedRegion: SingaporeRegion;
  allRegionsData: Record<SingaporeRegion, RegionalPsiData>;
  onSelectRegion: (region: SingaporeRegion) => void;
  userLocationName?: string;
  userCoordinates?: { lat: number; lng: number };
}

// High-fidelity NEA Singapore Planning Sector boundaries
const REGION_GEO_BOUNDARIES: Record<
  Exclude<SingaporeRegion, 'national'>,
  {
    name: string;
    sublabel: string;
    center: [number, number];
    coordinates: [number, number][];
  }
> = {
  north: {
    name: 'North Region',
    sublabel: 'Woodlands, Mandai & Yishun',
    center: [1.428, 103.825],
    coordinates: [
      [1.472, 103.795],
      [1.468, 103.825],
      [1.455, 103.855],
      [1.435, 103.875],
      [1.405, 103.880],
      [1.378, 103.870],
      [1.372, 103.825],
      [1.365, 103.795],
      [1.390, 103.775],
      [1.435, 103.755],
      [1.455, 103.765],
      [1.472, 103.795],
    ],
  },
  central: {
    name: 'Central Region',
    sublabel: 'Orchard, Marina Bay, CBD & Toa Payoh',
    center: [1.312, 103.838],
    coordinates: [
      [1.372, 103.825],
      [1.355, 103.850],
      [1.348, 103.875],
      [1.325, 103.890],
      [1.300, 103.905],
      [1.285, 103.875],
      [1.272, 103.855],
      [1.265, 103.820],
      [1.278, 103.805],
      [1.305, 103.785],
      [1.335, 103.790],
      [1.360, 103.805],
      [1.372, 103.825],
    ],
  },
  south: {
    name: 'South Region',
    sublabel: 'Sentosa Island, Keppel & HarbourFront',
    center: [1.250, 103.830],
    coordinates: [
      [1.265, 103.820],
      [1.272, 103.855],
      [1.260, 103.875],
      [1.235, 103.880],
      [1.215, 103.860],
      [1.215, 103.830],
      [1.235, 103.810],
      [1.250, 103.795],
      [1.265, 103.820],
    ],
  },
  east: {
    name: 'East Region',
    sublabel: 'Changi Airport, Tampines & Katong',
    center: [1.355, 103.945],
    coordinates: [
      [1.405, 103.880],
      [1.395, 103.925],
      [1.415, 103.965],
      [1.410, 104.005],
      [1.385, 104.045],
      [1.345, 104.035],
      [1.310, 103.980],
      [1.295, 103.930],
      [1.300, 103.905],
      [1.325, 103.890],
      [1.348, 103.875],
      [1.378, 103.870],
      [1.405, 103.880],
    ],
  },
  west: {
    name: 'West Region',
    sublabel: 'Jurong, Tuas, Clementi & CCK',
    center: [1.340, 103.715],
    coordinates: [
      [1.435, 103.755],
      [1.390, 103.775],
      [1.365, 103.795],
      [1.335, 103.790],
      [1.305, 103.785],
      [1.278, 103.805],
      [1.265, 103.820],
      [1.250, 103.795],
      [1.275, 103.730],
      [1.255, 103.680],
      [1.215, 103.640],
      [1.260, 103.605],
      [1.325, 103.620],
      [1.370, 103.660],
      [1.420, 103.700],
      [1.435, 103.755],
    ],
  },
};

const getStatusColor = (psi: number): {
  base: string;
  border: string;
  label: string;
  glow: string;
  textColor: string;
} => {
  if (psi <= 50) {
    return {
      base: '#10b981',
      border: '#059669',
      label: 'Good Air',
      glow: 'rgba(16, 185, 129, 0.4)',
      textColor: '#047857',
    };
  }
  if (psi <= 100) {
    return {
      base: '#0ea5e9',
      border: '#0284c7',
      label: 'Moderate',
      glow: 'rgba(14, 165, 233, 0.4)',
      textColor: '#0369a1',
    };
  }
  if (psi <= 200) {
    return {
      base: '#f59e0b',
      border: '#d97706',
      label: 'Unhealthy',
      glow: 'rgba(245, 158, 11, 0.45)',
      textColor: '#b45309',
    };
  }
  if (psi <= 300) {
    return {
      base: '#f97316',
      border: '#ea580c',
      label: 'Very Unhealthy',
      glow: 'rgba(249, 115, 22, 0.5)',
      textColor: '#c2410c',
    };
  }
  return {
    base: '#e11d48',
    border: '#be123c',
    label: 'Hazardous',
    glow: 'rgba(225, 29, 72, 0.55)',
    textColor: '#9f1239',
  };
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
  const [mapStyle, setMapStyle] = useState<'osm' | 'voyager' | 'dark'>('osm');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [1.3521, 103.8198],
      zoom: 11,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
    });

    let tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (mapStyle === 'voyager') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    } else if (mapStyle === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    const tiles = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

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

  // Render Improved NEA Haze Zones Graphic
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (showHazeOverlay) {
      (Object.keys(REGION_GEO_BOUNDARIES) as Array<Exclude<SingaporeRegion, 'national'>>).forEach(
        (regionKey) => {
          const regionInfo = REGION_GEO_BOUNDARIES[regionKey];
          const data = allRegionsData[regionKey];
          const psi = data?.psi24Hourly ?? 70;
          const pm25 = data?.pm25OneHourly ?? 22;
          const isSelected = selectedRegion === regionKey;
          const color = getStatusColor(psi);

          // Improved Haze Zone Polygon Graphic
          const polygon = L.polygon(regionInfo.coordinates, {
            color: isSelected ? '#ffffff' : color.border,
            weight: isSelected ? 4 : 2.5,
            opacity: isSelected ? 1 : 0.85,
            fillColor: color.base,
            fillOpacity: isSelected ? 0.42 : 0.22,
            dashArray: isSelected ? undefined : '5, 5',
            className: isSelected ? 'leaflet-selected-zone' : 'leaflet-haze-zone',
          });

          polygon.on('click', () => {
            onSelectRegion(regionKey);
          });

          // Enhanced interactive tooltip
          polygon.bindTooltip(
            `<div style="font-family: system-ui, sans-serif; padding: 4px 6px;">
              <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${regionInfo.name}</div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">${regionInfo.sublabel}</div>
              <div style="display: flex; gap: 8px; font-size: 11px; font-weight: 700;">
                <span style="color: ${color.border}">24h PSI: ${psi}</span>
                <span style="color: #0369a1">1h PM2.5: ${pm25} µg/m³</span>
              </div>
              <div style="font-size: 10px; color: ${color.textColor}; margin-top: 3px; font-weight: 600;">
                ● ${data?.status || color.label}
              </div>
            </div>`,
            { sticky: true, opacity: 0.98, className: 'custom-leaflet-tooltip' }
          );

          polygon.addTo(layerGroup);

          // Improved Interactive NEA Sector Graphic Badge
          const badgeHtml = `
            <div style="
              transform: translate(-50%, -50%);
              background: ${isSelected ? '#0f172a' : 'rgba(255, 255, 255, 0.95)'};
              color: ${isSelected ? '#ffffff' : '#0f172a'};
              border: ${isSelected ? '2.5px solid #ffffff' : `2px solid ${color.base}`};
              padding: 6px 10px;
              border-radius: 14px;
              box-shadow: 0 8px 16px -2px rgba(0,0,0,0.3), 0 0 0 ${isSelected ? '4px ' + color.glow : '0px transparent'};
              font-family: system-ui, -apple-system, sans-serif;
              cursor: pointer;
              transition: all 0.2s ease;
              white-space: nowrap;
              user-select: none;
            ">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 2px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${isSelected ? '#93c5fd' : '#475569'};">
                  ${regionKey.toUpperCase()}
                </span>
                <span style="
                  font-size: 9px;
                  font-weight: 800;
                  padding: 1px 5px;
                  border-radius: 9999px;
                  background: ${color.base};
                  color: #ffffff;
                ">
                  ${data?.status || color.label}
                </span>
              </div>
              <div style="display: flex; align-items: baseline; gap: 6px;">
                <span style="font-size: 15px; font-weight: 900; font-family: monospace; color: ${isSelected ? '#ffffff' : '#0f172a'};">
                  PSI ${psi}
                </span>
                <span style="font-size: 10px; font-weight: 600; color: ${isSelected ? '#cbd5e1' : '#64748b'};">
                  PM2.5: ${pm25}
                </span>
              </div>
            </div>
          `;

          const badgeIcon = L.divIcon({
            className: 'nea-sector-badge',
            html: badgeHtml,
            iconSize: [0, 0],
          });

          const centerMarker = L.marker(regionInfo.center, { icon: badgeIcon });
          centerMarker.on('click', () => onSelectRegion(regionKey));
          centerMarker.addTo(layerGroup);
        }
      );
    }

    // Geocoded User Location Marker
    if (userCoordinates && typeof userCoordinates.lat === 'number' && typeof userCoordinates.lng === 'number') {
      const pinIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div style="
            position: relative;
            width: 36px;
            height: 36px;
            transform: translate(-18px, -36px);
          ">
            <div style="
              position: absolute;
              inset: -4px;
              border-radius: 50%;
              background: #ef4444;
              opacity: 0.35;
              animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              position: relative;
              width: 36px;
              height: 36px;
              background: linear-gradient(135deg, #ef4444, #dc2626);
              border: 3px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 8px 16px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background: #ffffff;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const userMarker = L.marker([userCoordinates.lat, userCoordinates.lng], {
        icon: pinIcon,
        zIndexOffset: 1000,
      });

      userMarker.bindPopup(
        `<div style="font-family: system-ui, sans-serif; padding: 4px 6px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">
            📍 ${userLocationName || 'Selected Location'}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
            Coordinates: ${userCoordinates.lat.toFixed(4)}, ${userCoordinates.lng.toFixed(4)}
          </div>
          <div style="
            display: inline-block;
            font-size: 11px;
            font-weight: 700;
            color: #0369a1;
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            padding: 2px 6px;
            border-radius: 6px;
          ">
            Assigned NEA Sector: ${selectedRegion.toUpperCase()} · PSI ${allRegionsData[selectedRegion]?.psi24Hourly ?? '--'}
          </div>
        </div>`
      );

      userMarker.addTo(layerGroup);
      userMarkerRef.current = userMarker;
    }
  }, [selectedRegion, allRegionsData, showHazeOverlay, userCoordinates, userLocationName, onSelectRegion]);

  // Pan to user location when coordinates change
  useEffect(() => {
    if (mapRef.current && userCoordinates && typeof userCoordinates.lat === 'number') {
      mapRef.current.flyTo([userCoordinates.lat, userCoordinates.lng], 13, {
        duration: 1.2,
      });
      userMarkerRef.current?.openPopup();
    }
  }, [userCoordinates]);

  // Trigger leaflet recalculation on fullscreen toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const handleResetView = () => {
    mapRef.current?.flyTo([1.3521, 103.8198], 11, { duration: 1 });
  };

  const handleFocusRegion = (regionKey: SingaporeRegion) => {
    onSelectRegion(regionKey);
    if (regionKey === 'national') {
      handleResetView();
      return;
    }
    const center = REGION_GEO_BOUNDARIES[regionKey]?.center;
    if (center && mapRef.current) {
      mapRef.current.flyTo(center, 12, { duration: 1 });
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl bg-slate-950 border border-slate-800 p-4 sm:p-6 overflow-hidden select-none transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none p-4 sm:p-6 flex flex-col justify-between bg-slate-950'
          : 'shadow-xl'
      }`}
    >
      {/* Map Header with OpenStreetMap Attribution & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div>
            <span className="font-bold text-white text-sm">OpenStreetMap (OSM) Singapore Air Quality Engine</span>
            <span className="hidden lg:inline text-slate-400 text-xs ml-2">
              · Real-world street topology & official NEA haze sectors
            </span>
          </div>
        </div>

        {/* Map Interactive Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Haze Zone Color Overlay */}
          <button
            type="button"
            onClick={() => setShowHazeOverlay(!showHazeOverlay)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showHazeOverlay
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 shadow-xs'
                : 'bg-slate-800/90 text-slate-400 border-slate-700'
            }`}
            title="Toggle NEA Regional Boundaries"
          >
            {showHazeOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showHazeOverlay ? 'Haze Zones: ON' : 'Haze Zones: OFF'}</span>
          </button>

          {/* Map Layer Style */}
          <button
            type="button"
            onClick={() => {
              if (mapStyle === 'osm') setMapStyle('voyager');
              else if (mapStyle === 'voyager') setMapStyle('dark');
              else setMapStyle('osm');
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Switch Map Tile Style"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {mapStyle === 'osm'
                ? 'OSM Standard'
                : mapStyle === 'voyager'
                ? 'OSM Voyager'
                : 'OSM Dark'}
            </span>
          </button>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Reset to full Singapore island view"
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Fit Island</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isFullscreen
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                : 'bg-white text-slate-950 border-white hover:bg-slate-100'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Maximize Map'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Full View' : 'Maximize'}</span>
          </button>
        </div>
      </div>

      {/* Maximised OpenStreetMap Container */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-0 transition-all ${
          isFullscreen ? 'flex-1 min-h-[70vh]' : 'h-[520px] sm:h-[580px] lg:h-[640px]'
        }`}
      >
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>

      {/* Quick Interactive Sector Switcher Ribbon */}
      <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              Active Focus: <strong className="text-white text-sm">{allRegionsData[selectedRegion]?.displayName}</strong>
            </span>
            <span className="text-slate-400 font-mono">
              (24h PSI: {allRegionsData[selectedRegion]?.psi24Hourly ?? '--'} · 1h PM2.5: {allRegionsData[selectedRegion]?.pm25OneHourly ?? '--'} µg/m³)
            </span>
          </div>

          {/* Quick Legend */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
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
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> 201-300 Very Unhealthy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> 300+ Hazardous
            </span>
          </div>
        </div>

        {/* 5 NEA Regional Sector Quick Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {(['national', 'central', 'south', 'north', 'east', 'west'] as SingaporeRegion[]).map((rKey) => {
            const data = allRegionsData[rKey];
            const isSelected = selectedRegion === rKey;
            const color = getStatusColor(data?.psi24Hourly ?? 70);

            return (
              <button
                key={rKey}
                type="button"
                onClick={() => handleFocusRegion(rKey)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white border-white shadow-md ring-2 ring-sky-400/40'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-bold truncate">
                    {rKey === 'national' ? 'National' : rKey.toUpperCase()}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color.base }}
                  />
                </div>
                <div className="text-xs font-mono font-bold text-white">
                  PSI {data?.psi24Hourly ?? '--'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {data?.status ?? 'Moderate'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
