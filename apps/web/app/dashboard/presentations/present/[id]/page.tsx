'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/lib/ui';
import { ArrowLeft, ArrowRight, X, Expand, Minimize } from 'lucide-react';

interface Slide {
  id: string;
  type: 'song' | 'scripture' | 'announcement' | 'image' | 'prayer';
  content: any;
}

interface Service {
  id: string;
  title: string;
  date: string;
  slides: Slide[];
}

export default function PresentationPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [service, setService] = useState<Service | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    fetchService();
  }, [params.id]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          previousSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case 'Escape':
          exitFullscreen();
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, service]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('church_services')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
      router.push('/dashboard/presentations');
    } finally {
      setLoading(false);
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const nextSlide = () => {
    if (service && currentSlide < service.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (fullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const renderSlide = (slide: Slide) => {
    const baseClass = fullscreen 
      ? "flex items-center justify-center h-screen p-16 text-white" 
      : "flex items-center justify-center h-[600px] p-12 text-gray-900";

    switch (slide.type) {
      case 'song':
        return (
          <div className={`${baseClass} text-center`}>
            <div>
              <h2 className="text-5xl font-bold mb-8">{slide.content.title}</h2>
              {slide.content.artist && (
                <p className="text-2xl mb-8 opacity-75">{slide.content.artist}</p>
              )}
              <div className="text-3xl leading-relaxed whitespace-pre-wrap">
                {slide.content.currentVerse || slide.content.lyrics}
              </div>
            </div>
          </div>
        );

      case 'scripture':
        return (
          <div className={`${baseClass} text-center`}>
            <div>
              <h2 className="text-4xl font-bold mb-8">{slide.content.reference}</h2>
              <p className="text-3xl leading-relaxed max-w-4xl mx-auto">
                {slide.content.text}
              </p>
              {slide.content.version && (
                <p className="text-xl mt-8 opacity-75">{slide.content.version}</p>
              )}
            </div>
          </div>
        );

      case 'announcement':
        return (
          <div className={`${baseClass} text-center`}>
            <div>
              <h2 className="text-5xl font-bold mb-8">{slide.content.title || 'Anuncio'}</h2>
              <p className="text-3xl leading-relaxed max-w-4xl mx-auto">
                {slide.content.text}
              </p>
            </div>
          </div>
        );

      case 'prayer':
        return (
          <div className={`${baseClass} text-center`}>
            <div>
              <h2 className="text-5xl font-bold mb-8">Oración</h2>
              <p className="text-3xl leading-relaxed max-w-4xl mx-auto">
                {slide.content.text}
              </p>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className={`${baseClass}`}>
            {slide.content.url ? (
              <img 
                src={slide.content.url} 
                alt={slide.content.caption || 'Imagen de presentación'}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <p className="text-2xl opacity-50">Imagen no disponible</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Cargando presentación...</div>
      </div>
    );
  }

  if (!service || service.slides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 mb-4">No se encontró la presentación</p>
        <Button onClick={() => router.push('/dashboard/presentations')}>
          Volver
        </Button>
      </div>
    );
  }

  const currentSlideData = service.slides[currentSlide];

  return (
    <div className={`relative ${fullscreen ? 'bg-black' : 'bg-gray-100'} min-h-screen`}>
      {/* Controls */}
      {!fullscreen && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/presentations')}
          >
            <X className="mr-2 h-4 w-4" />
            Salir
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold">{service.title}</h1>
            <p className="text-sm text-gray-600">
              Diapositiva {currentSlide + 1} de {service.slides.length}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
          >
            <Expand className="mr-2 h-4 w-4" />
            Pantalla Completa
          </Button>
        </div>
      )}

      {/* Slide Content */}
      <div className={fullscreen ? '' : 'pt-20'}>
        {renderSlide(currentSlideData)}
      </div>

      {/* Navigation Controls */}
      <div className={`absolute bottom-8 left-0 right-0 flex justify-center gap-4 ${fullscreen ? 'opacity-0 hover:opacity-100 transition-opacity' : ''}`}>
        <Button
          variant={fullscreen ? 'outline' : 'default'}
          size="lg"
          onClick={previousSlide}
          disabled={currentSlide === 0}
          className={fullscreen ? 'bg-black/50 border-white text-white' : ''}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Anterior
        </Button>
        
        <Button
          variant={fullscreen ? 'outline' : 'default'}
          size="lg"
          onClick={nextSlide}
          disabled={currentSlide === service.slides.length - 1}
          className={fullscreen ? 'bg-black/50 border-white text-white' : ''}
        >
          Siguiente
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {fullscreen && (
          <Button
            variant="outline"
            size="lg"
            onClick={exitFullscreen}
            className="bg-black/50 border-white text-white"
          >
            <Minimize className="mr-2 h-5 w-5" />
            Salir
          </Button>
        )}
      </div>

      {/* Slide Indicators */}
      <div className={`absolute bottom-4 left-0 right-0 flex justify-center gap-2 ${fullscreen ? 'opacity-0 hover:opacity-100 transition-opacity' : ''}`}>
        {service.slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? (fullscreen ? 'bg-white w-8' : 'bg-gray-900 w-8')
                : (fullscreen ? 'bg-white/30' : 'bg-gray-400')
            }`}
          />
        ))}
      </div>

      {/* Keyboard shortcuts hint */}
      {!fullscreen && (
        <div className="absolute bottom-4 right-4 text-sm text-gray-500">
          <p>← → Navegar | F Pantalla completa | ESC Salir</p>
        </div>
      )}
    </div>
  );
}