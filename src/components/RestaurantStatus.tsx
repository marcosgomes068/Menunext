'use client';

import { useMenu } from '@/contexts/MenuContext';
import { useState, useEffect } from 'react';

export default function RestaurantStatus() {
  const { settings } = useMenu();
  const [isVisible, setIsVisible] = useState(true);
  const [isPulse, setIsPulse] = useState(false);

  // Animação de pulse periódica
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulse(true);
      setTimeout(() => setIsPulse(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-40">
      <div
        className={`
          relative bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border
          transition-all duration-300 hover:shadow-xl hover:scale-105
          ${settings.isOpen 
            ? 'border-green-200 hover:border-green-300' 
            : 'border-red-200 hover:border-red-300'
          }
          ${isPulse ? 'animate-pulse' : ''}
        `}
      >
        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          <div
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${settings.isOpen 
                ? 'bg-green-500 shadow-green-500/50' 
                : 'bg-red-500 shadow-red-500/50'
              }
              ${isPulse ? 'shadow-lg animate-ping' : 'shadow-sm'}
            `}
          />
          <span
            className={`
              text-sm font-medium transition-colors duration-300
              ${settings.isOpen ? 'text-green-700' : 'text-red-700'}
            `}
          >
            {settings.isOpen ? settings.openingMessage : settings.closedMessage}
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-1 -right-1 w-5 h-5 bg-gray-100 hover:bg-gray-200 
                     rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700
                     transition-colors duration-200 text-xs"
          title="Ocultar status"
        >
          ×
        </button>

        {/* Glow Effect when Open */}
        {settings.isOpen && (
          <div
            className={`
              absolute inset-0 rounded-full bg-green-500/10 
              transition-opacity duration-300
              ${isPulse ? 'opacity-100' : 'opacity-0'}
            `}
          />
        )}
      </div>

      {/* Reshow Button when Hidden */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-md 
                     transition-all duration-200 hover:shadow-lg"
          title="Mostrar status do restaurante"
        >
          <div
            className={`
              w-3 h-3 rounded-full
              ${settings.isOpen ? 'bg-green-500' : 'bg-red-500'}
            `}
          />
        </button>
      )}
    </div>
  );
}
