import React, { useState } from 'react';
import { RegionalPsiData, SingaporeRegion } from '../types/haze';
import { MapPin, Info, Compass, Shield } from 'lucide-react';

interface SingaporeRegionalMapProps {
  selectedRegion: SingaporeRegion;
  allRegionsData: Record<SingaporeRegion, RegionalPsiData>;
  onSelectRegion: (region: SingaporeRegion) => void;
  userLocationName?: string;
  userCoordinates?: { lat: number; lng: number };
}

export const SingaporeRegionalMap: React.FC<SingaporeRegionalMapProps> = ({
  selectedRegion,
  allRegionsData,
  onSelectRegion,
  userLocationName,
  userCoordinates,
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<SingaporeRegion | null>(null);

  // Region color helper based on PSI status
  const getRegionFill = (regionId: SingaporeRegion, isSelected: boolean, isHovered: boolean) => {
    const psi = allRegionsData[regionId]?.psi24Hourly ?? 70;
    let baseColor = '#0ea5e9'; // sky (Moderate)
    let strokeColor = '#0284c7';

    if (psi <= 50) {
      baseColor = '#10b981'; // emerald (Good)
      strokeColor = '#059669';
    } else if (psi <= 100) {
      baseColor = '#38bdf8'; // sky (Moderate)
      strokeColor = '#0284c7';
    } else if (psi <= 200) {
      baseColor = '#f59e0b'; // amber (Unhealthy)
      strokeColor = '#d97706';
    } else if (psi <= 300) {
      baseColor = '#f97316'; // orange (Very Unhealthy)
      strokeColor = '#ea580c';
    } else {
      baseColor = '#e11d48'; // rose (Hazardous)
      strokeColor = '#be123c';
    }

    if (isSelected) {
      return { fill: baseColor, opacity: 0.85, stroke: '#0f172a', strokeWidth: 3.5 };
    }
    if (isHovered) {
      return { fill: baseColor, opacity: 0.65, stroke: strokeColor, strokeWidth: 2.5 };
    }
    return { fill: baseColor, opacity: 0.35, stroke: strokeColor, strokeWidth: 1.5 };
  };

  // SVG Geographic Sector Definitions for Singapore Island
  // Coordinates mapped on viewBox="0 0 1000 620"
  // (0,0) Northwest Johor Strait -> (1000, 620) Southeast Singapore Strait
  const regions = [
    {
      id: 'north' as SingaporeRegion,
      name: 'North Region',
      sub: 'Woodlands, Mandai & Yishun',
      center: { x: 505, y: 155 },
      // Geographic shape covering Northern coast along Johor Strait, Woodlands, Sembawang, Simpang, Mandai
      path: 'M 350,195 L 390,130 L 450,85 L 530,65 L 610,75 L 670,120 L 685,160 L 610,210 L 525,230 L 450,225 L 390,210 Z',
    },
    {
      id: 'west' as SingaporeRegion,
      name: 'West Region',
      sub: 'Jurong, Tuas & Clementi',
      center: { x: 260, y: 340 },
      // Western Singapore including Tuas industrial arm, Jurong East/West, Choa Chu Kang, Bukit Batok, Clementi
      path: 'M 140,430 L 70,390 L 105,330 L 175,270 L 260,230 L 350,195 L 390,210 L 410,270 L 390,375 L 340,420 L 280,450 L 190,440 Z',
    },
    {
      id: 'central' as SingaporeRegion,
      name: 'Central Region',
      sub: 'Orchard, Marina Bay, CBD & Bishan',
      center: { x: 520, y: 335 },
      // Central Singapore core: Bishan, Toa Payoh, Novena, Orchard, Civic District, Marina Bay, Tanjong Pagar
      path: 'M 410,270 L 450,225 L 525,230 L 610,210 L 635,270 L 640,360 L 590,410 L 530,440 L 460,420 L 390,375 Z',
    },
    {
      id: 'east' as SingaporeRegion,
      name: 'East Region',
      sub: 'Changi Airport, Tampines & Katong',
      center: { x: 775, y: 300 },
      // Eastern bulge of Singapore: Tampines, Pasir Ris, Changi Airport point, Bedok, East Coast Park
      path: 'M 610,210 L 685,160 L 760,175 L 850,210 L 920,250 L 945,300 L 900,345 L 820,380 L 730,395 L 640,360 L 635,270 Z',
    },
    {
      id: 'south' as SingaporeRegion,
      name: 'South Region',
      sub: 'Sentosa Island, Keppel & HarbourFront',
      center: { x: 485, y: 515 },
      // Southern coast & islands: Sentosa Island, Keppel Bay, Telok Blangah, St John\'s
      path: 'M 460,420 L 530,440 L 590,410 L 580,470 L 550,540 L 490,565 L 430,545 L 415,480 Z',
    },
  ];

  // Specific user pin location mapping on SVG coordinates
  const getUserPinCoordinates = (): { x: number; y: number } | null => {
    // 1. If exact GPS/OneMap coordinates are provided, project them to SVG viewBox 0 0 1000 620
    if (userCoordinates && typeof userCoordinates.lat === 'number' && typeof userCoordinates.lng === 'number') {
      const minLng = 103.605;
      const maxLng = 104.015;
      const minLat = 1.235;
      const maxLat = 1.465;

      const clampLng = Math.max(minLng, Math.min(maxLng, userCoordinates.lng));
      const clampLat = Math.max(minLat, Math.min(maxLat, userCoordinates.lat));

      const x = 90 + ((clampLng - minLng) / (maxLng - minLng)) * 850;
      const y = 80 + ((maxLat - clampLat) / (maxLat - minLat)) * 480;

      return { x: Math.round(x), y: Math.round(y) };
    }

    if (!userLocationName) return null;
    const clean = userLocationName.toLowerCase();

    if (clean.includes('sentosa') || clean.includes('universal') || clean.includes('rws') || clean.includes('siloso')) {
      return { x: 490, y: 535 };
    }
    if (clean.includes('marina bay') || clean.includes('mbs') || clean.includes('gardens by the bay') || clean.includes('bayfront')) {
      return { x: 565, y: 395 };
    }
    if (clean.includes('orchard') || clean.includes('somerset') || clean.includes('ion')) {
      return { x: 515, y: 350 };
    }
    if (clean.includes('changi') || clean.includes('jewel') || clean.includes('airport')) {
      return { x: 900, y: 285 };
    }
    if (clean.includes('zoo') || clean.includes('mandai') || clean.includes('night safari') || clean.includes('bird paradise')) {
      return { x: 470, y: 175 };
    }
    if (clean.includes('chinatown') || clean.includes('clarke quay') || clean.includes('city hall') || clean.includes('bugis')) {
      return { x: 540, y: 375 };
    }
    if (clean.includes('jurong') || clean.includes('science centre') || clean.includes('snow city')) {
      return { x: 300, y: 355 };
    }

    // Default to the center of the selected region
    const matched = regions.find((r) => r.id === selectedRegion);
    return matched ? { x: matched.center.x, y: matched.center.y - 15 } : null;
  };

  const userPin = getUserPinCoordinates();

  return (
    <div className="relative w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 overflow-hidden select-none">
      {/* Background Grid Pattern & Compass */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Map Header with Legend & Compass */}
      <div className="flex items-center justify-between gap-4 mb-4 relative z-10 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="font-semibold text-white">Singapore NEA Official Air Quality Sectors</span>
          <span className="hidden sm:inline text-slate-400">· Tap any region</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          {/* North Compass */}
          <div className="flex items-center gap-1 font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>N</span>
          </div>

          {/* Quick Legend */}
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> 0-50 Good
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" /> 51-100 Mod
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> 101-200 Unhealthy
            </span>
          </div>
        </div>
      </div>

      {/* High-Accuracy SVG Geographic Vector Map */}
      <div className="relative w-full aspect-[16/10] max-h-[380px] flex items-center justify-center">
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full filter drop-shadow-md"
          style={{ maxHeight: '100%' }}
        >
          {/* Surrounding Straits & Sea Water Accents */}
          <rect width="1000" height="620" fill="transparent" />

          {/* Regional Sector Polygons */}
          {regions.map((reg) => {
            const isSelected = selectedRegion === reg.id;
            const isHovered = hoveredRegion === reg.id;
            const style = getRegionFill(reg.id, isSelected, isHovered);
            const data = allRegionsData[reg.id];

            return (
              <g
                key={reg.id}
                onClick={() => onSelectRegion(reg.id)}
                onMouseEnter={() => setHoveredRegion(reg.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="cursor-pointer transition-transform duration-200"
              >
                {/* Sector Geographic Boundary */}
                <path
                  d={reg.path}
                  fill={style.fill}
                  fillOpacity={style.opacity}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeLinejoin="round"
                  className="transition-all duration-300 hover:brightness-110"
                />

                {/* Region Center Marker Badge */}
                <g transform={`translate(${reg.center.x}, ${reg.center.y})`}>
                  {/* Backdrop Pill */}
                  <rect
                    x="-65"
                    y="-20"
                    width="130"
                    height="40"
                    rx="12"
                    fill={isSelected ? '#0f172a' : '#1e293b'}
                    stroke={isSelected ? '#ffffff' : '#475569'}
                    strokeWidth={isSelected ? '2' : '1'}
                    className="shadow-lg filter drop-shadow"
                  />

                  {/* Region Name Text */}
                  <text
                    x="0"
                    y="-4"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="700"
                    className="font-sans"
                  >
                    {reg.name.replace(' Region', '')}
                  </text>

                  {/* Real-time PSI & Status Readout */}
                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                    fontSize="11"
                    fontWeight="600"
                    className="font-mono tabular-nums"
                  >
                    PSI {data?.psi24Hourly ?? '--'} · {data?.status ?? 'Mod'}
                  </text>
                </g>
              </g>
            );
          })}

          {/* User's Keyed-in Location Marker Pin */}
          {userPin && (
            <g transform={`translate(${userPin.x}, ${userPin.y})`} className="animate-bounce">
              <circle r="18" fill="#ef4444" fillOpacity="0.3" className="animate-ping" />
              <circle r="12" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
              <circle r="4" fill="#ffffff" />

              {/* Pin Callout Tooltip */}
              <g transform="translate(0, -32)">
                <rect
                  x="-75"
                  y="-18"
                  width="150"
                  height="26"
                  rx="6"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="-2"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                >
                  📍 Your Location
                </text>
              </g>
            </g>
          )}

          {/* Watermarks & Coordinate Guides */}
          <text x="50" y="590" fill="#475569" fontSize="11" fontFamily="sans-serif">
            Singapore Strait / Malacca Waters
          </text>
          <text x="750" y="50" fill="#475569" fontSize="11" fontFamily="sans-serif">
            Johor Strait (Malaysia Border)
          </text>
        </svg>
      </div>

      {/* Selected Region Feedback Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            Active Focus: <strong className="text-white">{allRegionsData[selectedRegion]?.displayName}</strong>
          </span>
          <span className="text-slate-400 font-mono">
            (24h PSI: {allRegionsData[selectedRegion]?.psi24Hourly ?? '--'})
          </span>
        </div>

        <div className="text-[11px] text-slate-400">
          Click any zone directly on the map to switch live advisory
        </div>
      </div>
    </div>
  );
};
