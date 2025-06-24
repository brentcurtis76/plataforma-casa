import { Loader2, BookOpen, Mic, Music } from 'lucide-react';

interface LoadingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const LOADING_STEPS: LoadingStep[] = [
  { id: 'scripture', label: 'Buscando escritura...', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'meditation', label: 'Creando meditación...', icon: <Loader2 className="h-5 w-5 animate-spin" /> },
  { id: 'audio', label: 'Generando audio...', icon: <Mic className="h-5 w-5" /> },
  { id: 'ready', label: '¡Listo!', icon: <Music className="h-5 w-5" /> },
];

interface MeditationLoadingProps {
  currentStep: 'scripture' | 'meditation' | 'audio' | 'ready';
}

export function MeditationLoading({ currentStep }: MeditationLoadingProps) {
  const currentStepIndex = LOADING_STEPS.findIndex(step => step.id === currentStep);

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(currentStepIndex / (LOADING_STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="relative flex justify-between">
            {LOADING_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-300 z-10 bg-white
                      ${isCompleted ? 'bg-blue-500 text-white' : ''}
                      ${isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-100' : ''}
                      ${isPending ? 'bg-gray-100 text-gray-400' : ''}
                    `}
                  >
                    {step.icon}
                  </div>
                  <span 
                    className={`
                      text-xs mt-2 text-center max-w-[80px]
                      ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'}
                    `}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Status Message */}
        <div className="text-center">
          <p className="text-gray-600">
            {currentStep === 'scripture' && 'Consultando la Palabra de Dios para tu situación...'}
            {currentStep === 'meditation' && 'Preparando una meditación personalizada...'}
            {currentStep === 'audio' && 'Creando el audio para tu experiencia...'}
            {currentStep === 'ready' && '¡Tu meditación está lista!'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Skeleton screen for content that will appear
export function MeditationSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Scripture Card Skeleton */}
      <div className="bg-gray-100 rounded-lg p-8">
        <div className="text-center space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
        </div>
      </div>

      {/* Audio Player Skeleton */}
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="space-y-4">
          <div className="h-2 bg-gray-200 rounded-full" />
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-12" />
            <div className="h-4 bg-gray-200 rounded w-12" />
          </div>
          <div className="flex justify-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded" />
            <div className="h-16 w-16 bg-gray-200 rounded-full" />
            <div className="h-10 w-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Meditation Guide Skeleton */}
      <div className="bg-gray-100 rounded-lg p-8">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-3/6" />
          </div>
        </div>
      </div>
    </div>
  );
}