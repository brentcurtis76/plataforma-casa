'use client';

import { Card } from '@/lib/ui';
import { EMOTIONS } from '@/lib/ai/scripture-selector';

interface DashboardRecommendationsProps {
  recommendations: Array<{
    emotion: string;
    reason: string;
  }>;
  onSelectEmotion: (emotion: string) => void;
  loading?: boolean;
}

export function DashboardRecommendations({ 
  recommendations, 
  onSelectEmotion, 
  loading = false 
}: DashboardRecommendationsProps) {
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
        <span className="text-lg">🕊️</span>
        <h3 className="text-lg font-semibold">Sugerencias para ti:</h3>
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
                ${index === 0 ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
              `}
            >
              <div className="text-2xl mb-2">{config.icon}</div>
              <p className="font-medium">{emotionLabel}</p>
              <p className="text-xs mt-1 opacity-75">{rec.reason}</p>
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

interface DashboardQuickMeditationProps {
  lastEmotion: string | null;
  streak: number;
  onStart: (emotion: string) => void;
  loading?: boolean;
}

export function DashboardQuickMeditation({ 
  lastEmotion, 
  streak, 
  onStart, 
  loading = false 
}: DashboardQuickMeditationProps) {
  if (loading || !lastEmotion) {
    return null;
  }

  const getEmotionConfig = (emotion: string) => {
    const configs: Record<string, { icon: string; color: string }> = {
      joy: { icon: '😊', color: 'bg-yellow-100' },
      peace: { icon: '😌', color: 'bg-green-100' },
      gratitude: { icon: '🙏', color: 'bg-purple-100' },
      hope: { icon: '✨', color: 'bg-blue-100' },
      love: { icon: '💝', color: 'bg-pink-100' },
      anxiety: { icon: '😟', color: 'bg-orange-100' },
      fear: { icon: '😰', color: 'bg-gray-100' },
      sadness: { icon: '😔', color: 'bg-indigo-100' },
      anger: { icon: '😤', color: 'bg-red-100' },
      loneliness: { icon: '😞', color: 'bg-slate-100' },
      doubt: { icon: '🤔', color: 'bg-amber-100' },
      confusion: { icon: '😕', color: 'bg-teal-100' },
      guilt: { icon: '😓', color: 'bg-stone-100' },
      weakness: { icon: '😪', color: 'bg-zinc-100' },
      seeking: { icon: '🔍', color: 'bg-cyan-100' }
    };
    
    return configs[emotion] || { icon: '💭', color: 'bg-gray-100' };
  };

  const config = getEmotionConfig(lastEmotion);
  const emotionLabel = EMOTIONS[lastEmotion as keyof typeof EMOTIONS]?.es || lastEmotion;

  return (
    <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{config.icon}</div>
          <div>
            <p className="text-sm text-gray-600">Continuar con</p>
            <p className="font-semibold">{emotionLabel}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="text-center">
              <span className="text-sm text-gray-600">
                {streak === 1 ? '1 día en oración' : `${streak} días en oración`}
              </span>
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

interface DashboardGreetingProps {
  greeting: {
    greeting: string;
    icon: string;
    message: string;
  };
  loading?: boolean;
}

export function DashboardGreeting({ greeting, loading = false }: DashboardGreetingProps) {
  if (loading) {
    return (
      <div className="text-center mb-8 animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="text-center mb-8">
      <div className="text-4xl mb-2">{greeting.icon}</div>
      <h2 className="text-2xl font-bold mb-1">{greeting.greeting}</h2>
      <p className="text-gray-600">{greeting.message}</p>
    </div>
  );
}