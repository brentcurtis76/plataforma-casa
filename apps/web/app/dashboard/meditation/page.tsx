'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@church-admin/ui';
import { EMOTIONS } from '@/lib/ai/scripture-selector';
import { 
  Heart, 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind,
  Sparkles,
  HelpCircle,
  ChevronRight,
  History
} from 'lucide-react';
import Link from 'next/link';
import { SwipeableEmotionSelector, BottomSheet } from '@/components/meditation/MobileOptimized';
import { AccessibleEmotionGrid } from '@/components/meditation/Accessibility';
import { Onboarding, useOnboarding } from '@/components/meditation/Onboarding';
import { trackEmotionUsage } from '@/lib/services/meditation-extras';
import { useMeditationDashboard } from '@/hooks/useMeditationDashboard';
import { DashboardRecommendations, DashboardQuickMeditation, DashboardGreeting } from '@/components/meditation/DashboardComponents';

// Map emotions to icons and colors
const EMOTION_CONFIG = {
  // Positive emotions
  joy: { icon: Sun, color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' },
  peace: { icon: Heart, color: 'bg-green-100 hover:bg-green-200 text-green-800' },
  gratitude: { icon: Sparkles, color: 'bg-purple-100 hover:bg-purple-200 text-purple-800' },
  hope: { icon: Sun, color: 'bg-blue-100 hover:bg-blue-200 text-blue-800' },
  love: { icon: Heart, color: 'bg-pink-100 hover:bg-pink-200 text-pink-800' },
  
  // Challenging emotions
  anxiety: { icon: Wind, color: 'bg-orange-100 hover:bg-orange-200 text-orange-800' },
  fear: { icon: CloudRain, color: 'bg-gray-100 hover:bg-gray-200 text-gray-800' },
  sadness: { icon: CloudRain, color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800' },
  anger: { icon: Cloud, color: 'bg-red-100 hover:bg-red-200 text-red-800' },
  loneliness: { icon: Cloud, color: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
  
  // Spiritual states
  doubt: { icon: HelpCircle, color: 'bg-amber-100 hover:bg-amber-200 text-amber-800' },
  confusion: { icon: Wind, color: 'bg-teal-100 hover:bg-teal-200 text-teal-800' },
  guilt: { icon: Cloud, color: 'bg-stone-100 hover:bg-stone-200 text-stone-800' },
  weakness: { icon: CloudRain, color: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800' },
  seeking: { icon: Sparkles, color: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800' },
};

export default function MeditationPage() {
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const [showContextInput, setShowContextInput] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  // Use unified dashboard API
  const { data: dashboardData, loading: dashboardLoading } = useMeditationDashboard();
  const { showOnboarding, completeOnboarding } = useOnboarding();
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Override onboarding with server preferences if available
  useEffect(() => {
    if (dashboardData?.preferences) {
      // If server says onboarding should be shown, override local storage
      if (dashboardData.preferences.show_onboarding) {
        localStorage.removeItem('meditation_onboarding_completed');
      }
    }
  }, [dashboardData]);

  const handleEmotionSelect = async (emotion: string) => {
    if (emotion === '') {
      // Show all emotions
      setShowRecommendations(false);
      return;
    }
    
    setSelectedEmotion(emotion);
    setShowContextInput(true);
    
    // Track emotion usage for future recommendations
    try {
      await trackEmotionUsage(emotion);
    } catch (error) {
      console.error('Error tracking emotion:', error);
    }
  };

  const startMeditation = () => {
    if (!selectedEmotion) return;
    
    // Navigate to meditation session with selected emotion and context
    const params = new URLSearchParams({
      emotion: selectedEmotion,
      ...(additionalContext && { context: additionalContext })
    });
    
    router.push(`/dashboard/meditation/session?${params.toString()}`);
  };

  // Prepare emotions data for accessible components
  const emotionsForGrid = Object.entries(EMOTIONS).map(([key, value]) => {
    const config = EMOTION_CONFIG[key as keyof typeof EMOTION_CONFIG];
    return {
      key,
      label: value.es,
      Icon: config.icon,
      color: config.color
    };
  });

  // Organize emotions by category for mobile
  const emotionCategories = [
    {
      title: 'Emociones Positivas',
      emotions: ['joy', 'peace', 'gratitude', 'hope', 'love'].map(key => {
        const config = EMOTION_CONFIG[key as keyof typeof EMOTION_CONFIG];
        return {
          key,
          label: EMOTIONS[key as keyof typeof EMOTIONS].es,
          Icon: config.icon,
          color: config.color
        };
      })
    },
    {
      title: 'Emociones Desafiantes',
      emotions: ['anxiety', 'fear', 'sadness', 'anger', 'loneliness'].map(key => {
        const config = EMOTION_CONFIG[key as keyof typeof EMOTION_CONFIG];
        return {
          key,
          label: EMOTIONS[key as keyof typeof EMOTIONS].es,
          Icon: config.icon,
          color: config.color
        };
      })
    },
    {
      title: 'Estados Espirituales',
      emotions: ['doubt', 'confusion', 'guilt', 'weakness', 'seeking'].map(key => {
        const config = EMOTION_CONFIG[key as keyof typeof EMOTION_CONFIG];
        return {
          key,
          label: EMOTIONS[key as keyof typeof EMOTIONS].es,
          Icon: config.icon,
          color: config.color
        };
      })
    }
  ];

  return (
    <>
      {/* Onboarding */}
      {showOnboarding && (
        <Onboarding
          onComplete={completeOnboarding}
          onSkip={completeOnboarding}
        />
      )}
      
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Greeting */}
        <DashboardGreeting 
          greeting={dashboardData?.greeting || {
            greeting: 'Bienvenido',
            icon: '🕊️',
            message: 'Encuentra paz en la Palabra de Dios'
          }}
          loading={dashboardLoading}
        />

        {/* Quick Meditation for returning users */}
        <DashboardQuickMeditation
          lastEmotion={dashboardData?.lastEmotion || null}
          streak={dashboardData?.streak?.current_streak || 0}
          onStart={(emotion) => {
            setSelectedEmotion(emotion);
            startMeditation();
          }}
          loading={dashboardLoading}
        />

        {/* Emotion Selection */}
        {!showContextInput ? (
          <div id="emotion-selector">
            {showRecommendations ? (
              <DashboardRecommendations 
                recommendations={dashboardData?.recommendations || []}
                onSelectEmotion={handleEmotionSelect}
                loading={dashboardLoading}
              />
            ) : (
              <>
                <h2 className="text-xl font-semibold text-center mb-6">
                  ¿Cómo te sientes hoy?
                </h2>
                
                {isMobile ? (
                  <SwipeableEmotionSelector
                    categories={emotionCategories.map(category => ({
                      ...category,
                      emotions: category.emotions.map(emotion => {
                        const EmotionIcon = emotion.Icon;
                        return {
                          ...emotion,
                          icon: <EmotionIcon className="h-6 w-6" />
                        };
                      })
                    }))}
                    selectedEmotion={selectedEmotion}
                    onSelect={handleEmotionSelect}
                  />
                ) : (
                  <AccessibleEmotionGrid
                    emotions={emotionsForGrid.map(emotion => {
                      const EmotionIcon = emotion.Icon;
                      return {
                        ...emotion,
                        icon: <EmotionIcon className="h-6 w-6" />
                      };
                    })}
                    selectedEmotion={selectedEmotion}
                    onSelect={handleEmotionSelect}
                  />
                )}
              </>
            )}
          </div>
      ) : (
        <>
          {isMobile ? (
            <BottomSheet
              isOpen={showContextInput}
              onClose={() => {
                setShowContextInput(false);
                setSelectedEmotion(null);
                setAdditionalContext('');
              }}
              title={EMOTIONS[selectedEmotion as keyof typeof EMOTIONS]?.es || ''}
            >
              <div className="space-y-6">
                <p className="text-gray-600">
                  Dios tiene una palabra especial para ti en este momento
                </p>

                <div>
                  <label htmlFor="context" className="block text-sm font-medium mb-2">
                    ¿Quieres compartir más sobre cómo te sientes? (Opcional)
                  </label>
                  <textarea
                    id="context"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Puedes escribir aquí si deseas agregar más contexto..."
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowContextInput(false);
                      setSelectedEmotion(null);
                      setAdditionalContext('');
                    }}
                    className="flex-1"
                  >
                    Cambiar Emoción
                  </Button>
                  <Button
                    onClick={startMeditation}
                    className="flex-1"
                  >
                    Comenzar Meditación
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </BottomSheet>
          ) : (
            <Card className="max-w-2xl mx-auto p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    {(() => {
                      const Icon = EMOTION_CONFIG[selectedEmotion as keyof typeof EMOTION_CONFIG].icon;
                      return <Icon className="h-8 w-8 text-gray-600" />;
                    })()}
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">
                    {EMOTIONS[selectedEmotion as keyof typeof EMOTIONS].es}
                  </h2>
                  <p className="text-gray-600">
                    Dios tiene una palabra especial para ti en este momento
                  </p>
                </div>

                <div>
                  <label htmlFor="context" className="block text-sm font-medium mb-2">
                    ¿Quieres compartir más sobre cómo te sientes? (Opcional)
                  </label>
                  <textarea
                    id="context"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Puedes escribir aquí si deseas agregar más contexto..."
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowContextInput(false);
                      setSelectedEmotion(null);
                      setAdditionalContext('');
                    }}
                    className="flex-1"
                  >
                    Cambiar Emoción
                  </Button>
                  <Button
                    onClick={startMeditation}
                    className="flex-1"
                  >
                    Comenzar Meditación
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

        {/* Subtle Navigation */}
        <div className="flex justify-center gap-6 text-sm">
          <Link href="/dashboard/meditation/history" className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
            <History className="h-4 w-4" />
            Ver historial
          </Link>
          <Link href="/dashboard/meditation/favorites" className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Mis favoritos
          </Link>
        </div>

        {/* Simplified Spiritual Quote */}
        <div className="mt-12 text-center bg-blue-50 rounded-lg p-6">
          <p className="text-gray-700 italic">
            "Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu."
          </p>
          <p className="text-sm text-gray-600 mt-2">— Salmos 34:18</p>
        </div>
      </div>
    </>
  );
}