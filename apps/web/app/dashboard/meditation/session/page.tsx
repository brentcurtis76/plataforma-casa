'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, Card } from '@church-admin/ui';
import { EMOTIONS } from '@/lib/ai/scripture-selector';
import { generateMeditationAudio, MEDITATION_VOICES } from '@/lib/ai/voice-synthesis';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  RotateCcw,
  Heart,
  Loader2,
  ChevronLeft,
  Download
} from 'lucide-react';
import { MeditationLoading, MeditationSkeleton } from '@/components/meditation/LoadingStates';
import { MobileAudioPlayer } from '@/components/meditation/MobileOptimized';
import { AccessibleAudioPlayer } from '@/components/meditation/Accessibility';
import { addFavorite, removeFavorite, isFavorite } from '@/lib/services/meditation-extras';
import { ErrorDisplay, useRetry, NetworkStatus } from '@/components/meditation/ErrorHandling';

function MeditationSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const emotion = searchParams.get('emotion') || 'peace';
  const context = searchParams.get('context') || '';
  
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState<'scripture' | 'meditation' | 'audio' | 'ready'>('scripture');
  const [scripture, setScripture] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(MEDITATION_VOICES.maria.id);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const generateMeditation = async () => {
    try {
      setLoading(true);
      setLoadingStep('scripture');

      // Get scripture from AI via API route
      const scriptureResponse = await fetch('/api/meditation/scripture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion, context, language: 'es' })
      });
      
      if (!scriptureResponse.ok) {
        throw new Error('Failed to get scripture');
      }
      
      const scriptureResult = await scriptureResponse.json();
      setScripture(scriptureResult);
      setLoadingStep('meditation');

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Save meditation session to database
      const { data: session, error: sessionError } = await supabase
        .from('church_meditation_sessions')
        .insert({
          user_id: user.id,
          emotion,
          scripture_reference: scriptureResult.reference,
          scripture_text: scriptureResult.text,
          meditation_text: scriptureResult.meditationGuide,
          scripture_version: scriptureResult.version,
          voice_id: selectedVoice
        })
        .select()
        .single();

      if (sessionError) throw sessionError;
      setSessionId(session.id);
      
      // Check if this session is favorited
      checkFavoriteStatus(session.id);

      // Generate audio
      setLoadingStep('audio');
      const audioResult = await generateMeditationAudio(
        scriptureResult.text,
        scriptureResult.meditationGuide,
        selectedVoice
      );

      // Update session with audio URL
      await supabase
        .from('church_meditation_sessions')
        .update({
          audio_url: audioResult.audioUrl,
          duration: audioResult.duration
        })
        .eq('id', session.id);

      setAudioUrl(audioResult.audioUrl);
      setDuration(audioResult.duration);
      setLoadingStep('ready');
    } catch (error) {
      console.error('Error generating meditation:', error);
      throw error; // Let useRetry handle the error
    } finally {
      setTimeout(() => setLoading(false), 500); // Brief delay to show "ready" state
    }
  };

  const { execute: executeGeneration, retry: retryGeneration, retryCount } = useRetry(
    generateMeditation,
    {
      maxRetries: 3,
      onError: (err, attempt) => {
        console.error(`Generation failed (attempt ${attempt}):`, err);
        setError(err);
      }
    }
  );

  useEffect(() => {
    executeGeneration();
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const useFallbackContent = () => {
    setError(null);
    setScripture({
      reference: 'Filipenses 4:6-7',
      text: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
      version: 'RVR1960',
      meditationGuide: 'Respira profundamente y permite que estas palabras penetren en tu corazón. Dios te invita a entregarle todas tus preocupaciones. En este momento, imagina que depositas cada una de tus cargas en Sus manos amorosas. Siente cómo Su paz, esa paz que va más allá de todo entendimiento, comienza a llenar tu ser. Descansa en Su promesa de que Él cuida de ti.'
    });
    setLoadingStep('ready');
    setLoading(false);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      } else {
        audioRef.current.play();
        startProgressTracking();
      }
      setPlaying(!playing);
    }
  };

  const startProgressTracking = () => {
    progressInterval.current = setInterval(() => {
      if (audioRef.current) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
        setCurrentTime(audioRef.current.currentTime);
        
        if (currentProgress >= 100) {
          setPlaying(false);
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
        }
      }
    }, 100);
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      if (playing) {
        audioRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitFeedback = async (rating: number) => {
    if (!sessionId) return;

    // Update the session rating
    await supabase
      .from('church_meditation_sessions')
      .update({ user_feedback: rating })
      .eq('id', sessionId);

    // Auto-favorite meaningful sessions (4-5 stars)
    if (rating >= 4) {
      try {
        const alreadyFavorited = await isFavorite(sessionId);
        if (!alreadyFavorited) {
          await addFavorite(sessionId);
          setIsFavorited(true);
          // Optional: Show a subtle notification
          console.log('Auto-saved to favorites due to high rating');
        }
      } catch (error) {
        console.error('Error auto-favoriting session:', error);
      }
    }
  };

  const checkFavoriteStatus = async (id: string) => {
    try {
      const favorited = await isFavorite(id);
      setIsFavorited(favorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!sessionId) return;

    try {
      if (isFavorited) {
        await removeFavorite(sessionId);
        setIsFavorited(false);
      } else {
        await addFavorite(sessionId);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      const newProgress = (newTime / duration) * 100;
      setProgress(newProgress);
    }
  };

  if (error) {
    return (
      <>
        <NetworkStatus />
        <div className="flex items-center justify-center min-h-[600px] p-8">
          <ErrorDisplay 
            error={error} 
            onRetry={retryGeneration}
            onFallback={useFallbackContent}
            retryCount={retryCount}
          />
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <NetworkStatus />
        <div className="flex items-center justify-center min-h-[600px] p-8">
          <MeditationLoading currentStep={loadingStep} />
        </div>
      </>
    );
  }

  return (
    <>
      <NetworkStatus />
      <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/meditation')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">Meditación para</p>
          <p className="font-medium">{EMOTIONS[emotion as keyof typeof EMOTIONS]?.es}</p>
        </div>

        <div className="flex items-center gap-2">
          {isFavorited && (
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>Guardado</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Download functionality */}}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scripture Card */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-serif text-gray-800">
            {scripture?.reference}
          </h2>
          <blockquote className="text-lg text-gray-700 italic leading-relaxed max-w-3xl mx-auto">
            "{scripture?.text}"
          </blockquote>
          <p className="text-sm text-gray-500">{scripture?.version}</p>
        </div>
      </Card>

      {/* Audio Player */}
      {audioUrl ? (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration);
            }}
          />
          
          {isMobile ? (
            <MobileAudioPlayer
              isPlaying={playing}
              onPlayPause={togglePlayPause}
              progress={progress}
              duration={duration}
              onSeek={(percentage) => handleSeek((percentage / 100) * duration)}
            />
          ) : (
            <Card className="p-6">
              <AccessibleAudioPlayer
                isPlaying={playing}
                progress={progress}
                duration={duration}
                currentTime={currentTime}
                onPlayPause={togglePlayPause}
                onSeek={handleSeek}
              />
            </Card>
          )}
        </>
      ) : (
        <Card className="p-8 bg-yellow-50">
          <p className="text-center text-yellow-800">
            La generación de audio no está disponible en este momento. 
            Por favor, lee la meditación en voz alta para una mejor experiencia.
          </p>
        </Card>
      )}

      {/* Meditation Guide */}
      <Card className="p-8">
        <h3 className="text-lg font-semibold mb-4">Guía de Meditación</h3>
        <div className="prose prose-lg max-w-none text-gray-700">
          {scripture?.meditationGuide.split('\n').map((paragraph: string, index: number) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </Card>

      {/* Spiritual Reflection */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <p className="mb-4 text-gray-700">¿Cómo tocó tu corazón esta palabra de Dios?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => submitFeedback(rating)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title={rating >= 4 ? 'Se guardará automáticamente en tus favoritos' : ''}
              >
                <Heart 
                  className={`h-6 w-6 ${
                    rating <= 3 ? 'text-gray-400' : 'text-red-500'
                  }`}
                  fill={rating <= 3 ? 'none' : 'currentColor'}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Las meditaciones especialmente significativas se guardan automáticamente
          </p>
        </div>
      </Card>
    </div>
    </>
  );
}

export default function MeditationSessionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    }>
      <MeditationSessionContent />
    </Suspense>
  );
}