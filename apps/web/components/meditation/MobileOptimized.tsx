'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/lib/ui';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 bg-black transition-opacity duration-300 z-40
          ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}
        `}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className={`
          fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Handle */}
        <div className="flex justify-center pt-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}

interface EmotionCardProps {
  emotion: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export function EmotionCard({ emotion, label, icon, color, isSelected, onClick }: EmotionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-200
        min-h-[120px] w-full flex flex-col items-center justify-center
        transform active:scale-95 touch-manipulation
        ${color}
        ${isSelected ? 'border-gray-800 shadow-lg scale-105' : 'border-transparent'}
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
      
      {/* Icon with better touch target */}
      <div className="text-3xl mb-2">
        {icon}
      </div>
      
      {/* Label */}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

interface SwipeableEmotionSelectorProps {
  categories: {
    title: string;
    emotions: Array<{
      key: string;
      label: string;
      icon: React.ReactNode;
      color: string;
    }>;
  }[];
  selectedEmotion: string | null;
  onSelect: (emotion: string) => void;
}

export function SwipeableEmotionSelector({ 
  categories, 
  selectedEmotion, 
  onSelect 
}: SwipeableEmotionSelectorProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeCategory < categories.length - 1) {
      setActiveCategory(activeCategory + 1);
    }
    if (isRightSwipe && activeCategory > 0) {
      setActiveCategory(activeCategory - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(index)}
            className={`
              px-4 py-2 rounded-full whitespace-nowrap transition-all
              ${activeCategory === index 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-600'
              }
            `}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Swipeable Content */}
      <div 
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeCategory * 100}%)` }}
        >
          {categories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex}
              className="w-full flex-shrink-0 px-1"
            >
              <div className="grid grid-cols-2 gap-3">
                {category.emotions.map((emotion) => (
                  <EmotionCard
                    key={emotion.key}
                    emotion={emotion.key}
                    label={emotion.label}
                    icon={emotion.icon}
                    color={emotion.color}
                    isSelected={selectedEmotion === emotion.key}
                    onClick={() => onSelect(emotion.key)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center gap-2">
        {categories.map((_, index) => (
          <div
            key={index}
            className={`
              h-2 rounded-full transition-all duration-300
              ${activeCategory === index ? 'w-8 bg-gray-800' : 'w-2 bg-gray-300'}
            `}
          />
        ))}
      </div>
    </div>
  );
}

// Mobile-optimized audio player with gesture controls
export function MobileAudioPlayer({ 
  isPlaying, 
  onPlayPause, 
  progress, 
  duration,
  onSeek 
}: {
  isPlaying: boolean;
  onPlayPause: () => void;
  progress: number;
  duration: number;
  onSeek: (progress: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onSeek(percentage);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mx-4">
      {/* Large Progress Bar for easier touch */}
      <div 
        className="relative h-3 bg-gray-200 rounded-full mb-6 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-md"
          style={{ left: `${progress}%`, marginLeft: '-10px' }}
        />
      </div>

      {/* Large Play Button */}
      <div className="flex justify-center">
        <button
          onClick={onPlayPause}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-200 transform active:scale-95
            ${isPlaying 
              ? 'bg-gray-100 hover:bg-gray-200' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
          `}
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}