import React, { useState } from 'react';
import { Flame, AlertTriangle, Mountain } from 'lucide-react';

interface SOSCircularMenuProps {
  onSelectDisaster?: (disasterId: string) => void;
  disabled?: boolean;
}

const SOSCircularMenu: React.FC<SOSCircularMenuProps> = ({ onSelectDisaster }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSOSClick = () => {
    setIsOpen(!isOpen);
  };

  const handleDisasterSelect = (disasterId: string, label: string) => {
    if (onSelectDisaster) {
      onSelectDisaster(disasterId);
    } else {
      alert(`${label} emergency reported! Authorities have been notified.`);
    }
    setIsOpen(false);
  };

  const disasters = [
    { id: 'fire', label: 'FIRE', icon: Flame, angle: -90 },
    { id: 'accident', label: 'ACCIDENT', icon: AlertTriangle, angle: 30 },
    { id: 'landslide', label: 'LANDSLIDE', icon: Mountain, angle: 150 }
  ];

  // Calculate position for circular menu items
  const getPosition = (angle: number) => {
    const radius = 140;
    const radians = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);
    return { x, y };
  };

  return (
    <div className="relative">
      {/* Background overlay when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Disaster Option Buttons - Only visible when SOS is tapped */}
      {disasters.map((disaster) => {
        const { x, y } = getPosition(disaster.angle);
        const Icon = disaster.icon;
        
        return (
          <button
            key={disaster.id}
            onClick={() => handleDisasterSelect(disaster.id, disaster.label)}
            className={`fixed w-28 h-28 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-2 border-4 border-white z-30 ${
              isOpen 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-0 pointer-events-none'
            }`}
            style={{
              transform: isOpen 
                ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` 
                : 'translate(-50%, -50%)',
              left: '50%',
              bottom: '50%',
              transitionDelay: isOpen ? `${disaster.angle === -90 ? '50ms' : disaster.angle === 30 ? '100ms' : '150ms'}` : '0ms'
            }}
          >
            <Icon className="w-8 h-8" />
            <span className="font-bold tracking-wider">{disaster.label}</span>
          </button>
        );
      })}

      {/* Main SOS Button */}
      <button
        onClick={handleSOSClick}
        className={`fixed w-40 h-40 rounded-full font-bold text-3xl shadow-2xl transition-all duration-300 flex items-center justify-center z-40 ${
          isOpen
            ? 'bg-red-800 scale-105'
            : 'bg-red-600 hover:bg-red-700 scale-100'
        }`}
        style={{
          background: isOpen 
            ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)' 
            : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          boxShadow: isOpen
            ? '0 0 40px rgba(220, 38, 38, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.3)'
            : '0 15px 40px rgba(220, 38, 38, 0.5), 0 0 30px rgba(220, 38, 38, 0.3)',
          bottom: '2rem',
          left: '2rem'
        }}
      >
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white opacity-90" />
        
        {/* Inner Second Ring */}
        <div className="absolute inset-3 rounded-full border-2 border-white opacity-70" />
        
        {/* Text Content */}
        <span className="relative text-white font-bold tracking-widest">SOS</span>

        {/* Pulsing Animation */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-white opacity-40 animate-ping" />
            <div className="absolute -inset-6 rounded-full border-2 border-red-400 opacity-20 animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
};

export default SOSCircularMenu;