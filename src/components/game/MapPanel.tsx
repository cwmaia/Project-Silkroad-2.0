import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase';
import { Region } from './types';

interface MapPanelProps {
  currentLocationSlug?: string; // Optional: slug of the player's current region
  onSelectRegion: (slug: string) => void;
}

const MapPanel: React.FC<MapPanelProps> = ({ currentLocationSlug, onSelectRegion }) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegionSlug, setSelectedRegionSlug] = useState<string | null>(currentLocationSlug || null);
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore(app);
        const regionsCollection = collection(db, 'regions');
        const regionsSnapshot = await getDocs(regionsCollection);
        
        const regionsList: Region[] = [];
        regionsSnapshot.forEach((doc) => {
          regionsList.push({ slug: doc.id, ...doc.data() } as Region);
        });
        setRegions(regionsList);
      } catch (err) {
        console.error('Error fetching regions:', err);
        setError('Failed to fetch region data.');
      } finally {
        setLoading(false);
      }
    };
    fetchRegions();
  }, []);

  const handlePinClick = (slug: string) => {
    setSelectedRegionSlug(slug);
    onSelectRegion(slug);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-terminal-error';
      default: return 'text-gray-400';
    }
  };
  
  // Define map dimensions for coordinate system
  const MAP_WIDTH = 1000;
  const MAP_HEIGHT = 500;

  if (loading) return <div className="p-4 text-center text-cyan-400 animate-pulse">Loading map data...</div>;
  if (error) return <div className="p-4 text-center text-terminal-error">{error}</div>;

  return (
    <div className="h-full overflow-hidden bg-black border border-neutral-700 rounded-md relative font-mono">
      <div className="flex justify-between items-center p-3 border-b border-neutral-700 bg-black/80">
        <h2 className="text-lg text-cyan-400">
          <span className="animate-flicker">{'>'}</span> REGIONAL MAP
        </h2>
        <div className="text-xs text-gray-500">
          {regions.length} regions identified
        </div>
      </div>

      {/* Map Area with Background Image */}
      <div 
        className="relative w-full h-[calc(100%-3rem)] overflow-hidden"
        style={{ 
          backgroundImage: 'url("/map/worldmap.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Semi-transparent overlay for visibility */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        
        {/* Subtle grid for coordinate reference */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-b border-neutral-800/30" style={{ top: `${i * 10}%` }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-r border-neutral-800/30" style={{ left: `${i * 10}%` }} />
          ))}
        </div>

        {/* Region Pins */}
        {regions.map((region) => {
          const isCurrent = region.slug === currentLocationSlug;
          const isSelected = region.slug === selectedRegionSlug;
          
          // Convert coordinates to percentage positions
          const left = `${(region.mapCoordinates.x / MAP_WIDTH) * 100}%`;
          const top = `${(region.mapCoordinates.y / MAP_HEIGHT) * 100}%`;
          
          // Determine pin styling based on state
          const pinSize = isCurrent || isSelected ? 'w-4 h-4' : 'w-3 h-3';
          const pinColor = isCurrent ? 'bg-yellow-400' : 'bg-cyan-400';
          const borderStyle = isCurrent 
            ? 'border-2 border-yellow-400 animate-pulse' 
            : 'border-2 border-black hover:border-white';
          const glowEffect = isSelected 
            ? 'shadow-[0_0_10px_2px_#00ffe0]' 
            : (isCurrent ? 'shadow-[0_0_10px_2px_#facc15]' : '');

          return (
            <div
              key={region.slug}
              className={`absolute ${pinSize} ${pinColor} rounded-full cursor-pointer ${borderStyle} ${glowEffect} transition-all duration-200 z-10`}
              style={{
                left: left,
                top: top,
                transform: 'translate(-50%, -50%)' // Center the pin
              }}
              onClick={() => handlePinClick(region.slug)}
              onMouseEnter={() => setHoveredRegion(region)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              {/* Inner dot for visual flair */}
              <div className="w-1/2 h-1/2 bg-black/50 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          );
        })}

        {/* Tooltip */}
        {hoveredRegion && (
          <div 
            className="absolute p-3 bg-black/90 border border-cyan-400 text-white text-xs rounded-md shadow-lg pointer-events-none z-50"
            style={{
              left: `${(hoveredRegion.mapCoordinates.x / MAP_WIDTH) * 100}%`,
              top: `${(hoveredRegion.mapCoordinates.y / MAP_HEIGHT) * 100}%`,
              transform: 'translate(-50%, -110%)', // Position above pin
              minWidth: '180px',
              backdropFilter: 'blur(3px)'
            }}
          >
            <h4 className="font-bold text-cyan-400 mb-1">{hoveredRegion.name}</h4>
            <p className={`${getRiskLevelColor(hoveredRegion.riskLevel)} mb-1`}>
              Risk Level: {hoveredRegion.riskLevel.toUpperCase()}
            </p>
            <p className="text-gray-400 text-xs">{hoveredRegion.theme}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPanel;
