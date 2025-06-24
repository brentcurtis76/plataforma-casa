'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/lib/ui';
import { Sparkles, Clock, TrendingUp } from 'lucide-react';
import { EMOTIONS } from '@/lib/ai/scripture-selector';
import { getEmotionRecommendations } from '@/lib/services/meditation-extras';

interface EmotionRecommendation {
  emotion: string;
  reason?: string;
  score?: number;
}

interface EmotionRecommendationsProps {
  onSelectEmotion: (emotion: string) => void;
}

export function EmotionRecommendations({ onSelectEmotion }: EmotionRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<EmotionRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const recs = await getEmotionRecommendations();
      // Always limit to exactly 3 recommendations for simplicity
      const limitedRecs = recs.length > 0 ? recs.slice(0, 3) : getDefaultRecommendations();
      setRecommendations(limitedRecs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      // Fall back to time-based defaults
      setRecommendations(getDefaultRecommendations());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultRecommendations = (): EmotionRecommendation[] => {
    const hour = new Date().getHours();
    
    // Always include peace as a core spiritual state
    const coreRecommendations = [
      { emotion: 'peace', reason: 'Encuentro con Dios' }
    ];
    
    if (hour < 12) {
      return [
        ...coreRecommendations,
        { emotion: 'hope', reason: 'Nuevo día con propósito' },
        { emotion: 'seeking', reason: 'Buscar dirección divina' }
      ];
    } else if (hour < 18) {
      return [
        ...coreRecommendations,
        { emotion: 'seeking', reason: 'Sabiduría para decisiones' },
        { emotion: 'gratitude', reason: 'Reconocer bendiciones' }
      ];
    } else {
      return [
        ...coreRecommendations,
        { emotion: 'gratitude', reason: 'Reflexión del día' },
        { emotion: 'love', reason: 'Conexión familiar' }
      ];
    }
  };

  const getEmotionConfig = (emotion: string) => {
    const configs: Record<string, { icon: string; color: string }> = {
      joy: { icon: '😊', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' },
      peace: { icon: '😌', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
      gratitude: { icon: '🙏', color: 'bg-purple-100 hover:bg-purple-200 text-purple-800' },
      hope: { icon: '✨', color: 'bg-blue-100 hover:bg-blue-200 text-blue-800' },
      love: { icon: '💝', color: 'bg-pink-100 hover:bg-pink-200 text-pink-800' },
      anxiety: { icon: '😟', color: 'bg-orange-100 hover:bg-orange-200 text-orange-800' },
      fear: { icon: '😰', color: 'bg-gray-100 hover:bg-gray-200 text-gray-800' },
      sadness: { icon: '😔', color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800' },
      anger: { icon: '😤', color: 'bg-red-100 hover:bg-red-200 text-red-800' },
      loneliness: { icon: '😞', color: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      doubt: { icon: '🤔', color: 'bg-amber-100 hover:bg-amber-200 text-amber-800' },
      confusion: { icon: '😕', color: 'bg-teal-100 hover:bg-teal-200 text-teal-800' },
      guilt: { icon: '😓', color: 'bg-stone-100 hover:bg-stone-200 text-stone-800' },
      weakness: { icon: '😪', color: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800' },
      seeking: { icon: '🔍', color: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800' }
    };
    
    return configs[emotion] || { icon: '💭', color: 'bg-gray-100 hover:bg-gray-200 text-gray-800' };
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">{getTimeGreeting()}, sugerencias para ti:</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.map((rec, index) => {
          const config = getEmotionConfig(rec.emotion);
          const emotionLabel = EMOTIONS[rec.emotion as keyof typeof EMOTIONS]?.es || rec.emotion;
          
          return (
            <button
              key={rec.emotion}
              onClick={() => onSelectEmotion(rec.emotion)}
              className={`
                p-4 rounded-lg transition-all duration-200 transform hover:scale-105
                ${config.color}
                ${index === 0 ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}
              `}
            >
              <div className="text-2xl mb-2">{config.icon}</div>
              <p className="font-medium">{emotionLabel}</p>
              {rec.reason && (
                <p className="text-xs mt-1 opacity-75">{rec.reason}</p>
              )}
              {index === 0 && (
                <div className="mt-2 text-xs flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Más elegido</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => onSelectEmotion('')}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          ¿Sientes algo diferente? Explora más opciones
        </button>
      </div>
    </Card>
  );
}

// Quick meditation launcher for returning users
interface QuickMeditationProps {
  onStart: (emotion: string) => void;
}

export function QuickMeditation({ onStart }: QuickMeditationProps) {
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Get last used emotion from recent sessions
    const getLastSession = async () => {
      try {
        const { getRecentSessions, getStreak } = await import('@/lib/services/meditation-extras');
        const sessions = await getRecentSessions(1);
        if (sessions.length > 0) {
          setLastEmotion(sessions[0].emotion);
        }
        
        const streakData = await getStreak();
        setStreak(streakData.current_streak);
      } catch (error) {
        console.error('Error loading last session:', error);
      }
    };
    
    getLastSession();
  }, []);

  if (!lastEmotion) return null;

  const emotionLabel = EMOTIONS[lastEmotion as keyof typeof EMOTIONS]?.es || lastEmotion;

  return (
    <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">💫</div>
          <div>
            <p className="text-sm text-gray-600">Continuar con</p>
            <p className="font-semibold">{emotionLabel}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="text-center">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">
                  {streak === 1 ? '1 día en oración' : `${streak} días en oración`}
                </span>
              </div>
            </div>
          )}
          
          <button
            onClick={() => onStart(lastEmotion)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continuar meditando
          </button>
        </div>
      </div>
    </Card>
  );
}

// Time-based greeting component
export function MeditationGreeting() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = 'amigo'; // Could be personalized with user name
    
    if (hour < 6) {
      return {
        greeting: `Que la paz de Dios te acompañe, ${name}`,
        icon: '🌙',
        message: 'Un momento de tranquilidad antes del descanso'
      };
    } else if (hour < 12) {
      return {
        greeting: `Buenos días, ${name}`,
        icon: '☀️',
        message: 'Comienza tu día con la Palabra de Dios'
      };
    } else if (hour < 18) {
      return {
        greeting: `Buenas tardes, ${name}`,
        icon: '🌤️',
        message: 'Un momento de reflexión en tu día'
      };
    } else {
      return {
        greeting: `Buenas noches, ${name}`,
        icon: '🌙',
        message: 'Encuentra paz al final del día'
      };
    }
  };

  const { greeting, icon, message } = getGreeting();

  return (
    <div className="text-center mb-8">
      <div className="text-4xl mb-2">{icon}</div>
      <h2 className="text-2xl font-bold mb-1">{greeting}</h2>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}