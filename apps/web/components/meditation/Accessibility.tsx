'use client';

import { useState, useEffect, useRef } from 'react';

interface AccessibleEmotionGridProps {
  emotions: Array<{
    key: string;
    label: string;
    icon: React.ReactNode;
    color: string;
  }>;
  selectedEmotion: string | null;
  onSelect: (emotion: string) => void;
}

export function AccessibleEmotionGrid({ 
  emotions, 
  selectedEmotion, 
  onSelect 
}: AccessibleEmotionGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gridRef.current) return;

      const buttons = gridRef.current.querySelectorAll('button');
      const currentIndex = focusedIndex;
      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = Math.min(currentIndex + 1, emotions.length - 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          // Assuming 3 columns, move down one row
          newIndex = Math.min(currentIndex + 3, emotions.length - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Move up one row
          newIndex = Math.max(currentIndex - 3, 0);
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = emotions.length - 1;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (buttons[currentIndex]) {
            (buttons[currentIndex] as HTMLButtonElement).click();
          }
          break;
      }

      if (newIndex !== currentIndex) {
        setFocusedIndex(newIndex);
        (buttons[newIndex] as HTMLButtonElement)?.focus();
      }
    };

    gridRef.current?.addEventListener('keydown', handleKeyDown);
    return () => gridRef.current?.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, emotions.length]);

  return (
    <div 
      ref={gridRef}
      role="radiogroup"
      aria-label="Selecciona tu estado emocional"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
    >
      {emotions.map((emotion, index) => (
        <button
          key={emotion.key}
          role="radio"
          aria-checked={selectedEmotion === emotion.key}
          aria-label={`${emotion.label}${selectedEmotion === emotion.key ? ', seleccionado' : ''}`}
          tabIndex={index === focusedIndex ? 0 : -1}
          onClick={() => onSelect(emotion.key)}
          onFocus={() => setFocusedIndex(index)}
          className={`
            p-6 rounded-lg border-2 transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2
            ${emotion.color}
            ${selectedEmotion === emotion.key ? 'ring-2 ring-gray-800 ring-offset-2' : 'border-transparent'}
          `}
        >
          <div aria-hidden="true" className="text-2xl mb-2">
            {emotion.icon}
          </div>
          <span className="font-medium">{emotion.label}</span>
        </button>
      ))}
    </div>
  );
}

// Audio player with screen reader announcements
interface AccessibleAudioPlayerProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

export function AccessibleAudioPlayer({
  isPlaying,
  progress,
  duration,
  currentTime,
  onPlayPause,
  onSeek
}: AccessibleAudioPlayerProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState('');

  // Format time for screen readers
  const formatTimeForSR = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins} minutos y ${secs} segundos`;
  };

  // Announce playback changes
  useEffect(() => {
    if (isPlaying) {
      setAnnouncement('Reproduciendo meditación');
    } else {
      setAnnouncement('Meditación pausada');
    }
  }, [isPlaying]);

  // Keyboard controls for progress bar
  const handleProgressKeyDown = (e: React.KeyboardEvent) => {
    const step = 5; // 5% steps
    let newProgress = progress;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newProgress = Math.min(progress + step, 100);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newProgress = Math.max(progress - step, 0);
        break;
      case 'Home':
        e.preventDefault();
        newProgress = 0;
        break;
      case 'End':
        e.preventDefault();
        newProgress = 100;
        break;
    }

    if (newProgress !== progress) {
      const newTime = (newProgress / 100) * duration;
      onSeek(newTime);
      setAnnouncement(`Saltando a ${formatTimeForSR(newTime)}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Progress bar */}
      <div
        ref={progressBarRef}
        role="slider"
        aria-label="Progreso de la meditación"
        aria-valuenow={Math.floor(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${formatTimeForSR(currentTime)} de ${formatTimeForSR(duration)}`}
        tabIndex={0}
        onKeyDown={handleProgressKeyDown}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div 
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between text-sm text-gray-500" aria-hidden="true">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Play/Pause button */}
      <button
        onClick={onPlayPause}
        aria-label={isPlaying ? 'Pausar meditación' : 'Reproducir meditación'}
        className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center
                   hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

// Skip links for keyboard navigation
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a 
        href="#main-content" 
        className="absolute top-0 left-0 bg-blue-600 text-white p-2 z-50 focus:outline-none"
      >
        Saltar al contenido principal
      </a>
      <a 
        href="#emotion-selector" 
        className="absolute top-0 left-32 bg-blue-600 text-white p-2 z-50 focus:outline-none"
      >
        Saltar a selector de emociones
      </a>
    </div>
  );
}

// High contrast mode support
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isHighContrast;
}

// Helper function to format time
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}