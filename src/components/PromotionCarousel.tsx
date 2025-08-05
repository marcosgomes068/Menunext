'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMenu } from '@/contexts/MenuContext';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function PromotionCarousel() {
  const { getActivePromotions } = useMenu();
  const promotions = getActivePromotions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating || promotions.length <= 1) return;
    
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, promotions.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating || promotions.length <= 1) return;
    
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, promotions.length]);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, currentIndex]);

  // Auto-advance carousel
  useEffect(() => {
    if (promotions.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Advance every 5 seconds

    return () => clearInterval(interval);
  }, [promotions.length, nextSlide]);

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
      {/* Carousel Container */}
      <div 
        className={`flex transition-transform duration-500 ease-in-out h-full ${
          isAnimating ? 'transform' : ''
        }`}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {promotions.map((promotion, index) => (
          <div
            key={promotion.id}
            className="flex-shrink-0 w-full h-full relative"
          >
            {/* Background Image */}
            {promotion.imageUrl && (
              <div className="absolute inset-0">
                <Image
                  src={promotion.imageUrl}
                  alt={promotion.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center text-center px-6 md:px-12">
              <div className="max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  {promotion.title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow-md">
                  {promotion.description}
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Peça Agora
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {promotions.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {promotions.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {promotions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`w-3 h-3 rounded-full transition-all duration-200 disabled:cursor-not-allowed ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {promotions.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{
              width: `${((currentIndex + 1) / promotions.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
