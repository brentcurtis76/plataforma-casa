import { useState, useEffect } from 'react';
import { Button, Card } from '@church-admin/ui';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  image?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Bienvenido a Meditación Guiada',
    description: 'Encuentra paz y consuelo en la Palabra de Dios con meditaciones personalizadas para tu situación actual.',
    image: (
      <div className="text-6xl mb-4">🙏</div>
    )
  },
  {
    title: 'Selecciona tu Emoción',
    description: 'Comienza eligiendo cómo te sientes. Nuestro sistema seleccionará escrituras específicas para tu estado emocional.',
    image: (
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">😊</div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">😔</div>
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">😌</div>
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">😟</div>
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">🤔</div>
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">💝</div>
      </div>
    )
  },
  {
    title: 'Meditación Personalizada',
    description: 'Recibirás una escritura cuidadosamente seleccionada y una guía de meditación con audio opcional para acompañarte.',
    image: (
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="text-4xl">📖</div>
        <div className="text-4xl">🎧</div>
      </div>
    )
  },
  {
    title: 'Guarda tus Favoritos',
    description: 'Marca las escrituras que más te inspiran para acceder a ellas fácilmente cuando las necesites.',
    image: (
      <div className="text-6xl mb-4">⭐</div>
    )
  },
  {
    title: 'Mantén tu Racha',
    description: 'Medita diariamente para mantener tu racha activa y fortalecer tu conexión espiritual.',
    image: (
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="text-3xl">🔥</div>
        <span className="text-2xl font-bold text-orange-500">7 días</span>
      </div>
    )
  }
];

interface OnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    if (onSkip) {
      setIsVisible(false);
      setTimeout(onSkip, 300);
    }
  };

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div 
      className={`
        fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <Card className="max-w-md w-full">
        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Paso {currentStep + 1} de {ONBOARDING_STEPS.length}
            </p>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            {step.image}
            <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
            <p className="text-gray-600">{step.description}</p>
          </div>

          {/* Custom Action */}
          {step.action && (
            <div className="mb-6">
              <Button
                onClick={step.action.onClick}
                variant="outline"
                className="w-full"
              >
                {step.action.label}
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={currentStep === 0 ? handleSkip : handlePrevious}
              disabled={!onSkip && currentStep === 0}
            >
              {currentStep === 0 ? 'Omitir' : <ChevronLeft className="h-4 w-4" />}
            </Button>

            <div className="flex gap-1">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${index === currentStep ? 'bg-blue-500 w-8' : 'bg-gray-300'}
                  `}
                />
              ))}
            </div>

            <Button onClick={handleNext}>
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                'Comenzar'
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Tooltip component for guided tour
interface TooltipProps {
  target: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onNext?: () => void;
  onClose?: () => void;
}

export function GuidedTooltip({ 
  target, 
  content, 
  position = 'bottom',
  onNext,
  onClose 
}: TooltipProps) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const element = document.querySelector(target) as HTMLElement;
    if (element) {
      setTargetElement(element);
      element.classList.add('guided-tour-highlight');
      
      const rect = element.getBoundingClientRect();
      const tooltipWidth = 300;
      const tooltipHeight = 100;
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = rect.top - tooltipHeight - 10;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - 10;
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + 10;
          break;
      }
      
      setTooltipPosition({ top, left });
    }

    return () => {
      if (element) {
        element.classList.remove('guided-tour-highlight');
      }
    };
  }, [target, position]);

  if (!targetElement) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-20 z-40" onClick={onClose} />
      <div 
        className="fixed bg-white rounded-lg shadow-lg p-4 z-50 max-w-xs"
        style={{ 
          top: `${tooltipPosition.top}px`, 
          left: `${tooltipPosition.left}px`,
          width: '300px'
        }}
      >
        <p className="text-sm mb-3">{content}</p>
        <div className="flex justify-between">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          )}
          {onNext && (
            <Button size="sm" onClick={onNext}>
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

// Add CSS for highlighting
export const guidedTourStyles = `
  .guided-tour-highlight {
    position: relative;
    z-index: 45;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
    border-radius: 8px;
    transition: box-shadow 0.3s ease;
  }
`;

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('meditation_onboarding_completed');
    setHasSeenOnboarding(!!seen);
    
    if (!seen) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('meditation_onboarding_completed', 'true');
    setHasSeenOnboarding(true);
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('meditation_onboarding_completed');
    setHasSeenOnboarding(false);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    hasSeenOnboarding,
    completeOnboarding,
    resetOnboarding
  };
}