'use client';

import { useState } from 'react';
import { Button, Card } from '@church-admin/ui';
import { MessageSquare, X, Heart } from 'lucide-react';

interface FeedbackCollectorProps {
  onSubmit?: (feedback: UserFeedback) => void;
  trigger?: 'session_complete' | 'weekly' | 'manual';
}

interface UserFeedback {
  type: 'spiritual_impact' | 'feature_request' | 'technical_issue' | 'general';
  rating: number; // 1-5 stars
  message: string;
  suggestions?: string;
  spiritual_growth?: string;
  feature_priority?: string[];
}

const FEEDBACK_QUESTIONS = {
  spiritual_impact: {
    title: '¿Cómo ha impactado esta meditación tu relación con Dios?',
    placeholder: 'Comparte cómo Dios ha hablado a tu corazón...',
    followUp: '¿Hay alguna manera en que podríamos mejorar tu experiencia espiritual?'
  },
  feature_request: {
    title: '¿Qué características te ayudarían más en tu vida de oración?',
    placeholder: 'Describe las funciones que te gustaría ver...',
    followUp: '¿Cuál de estas sería más útil para tu crecimiento espiritual?'
  },
  technical_issue: {
    title: '¿Has encontrado algún problema técnico?',
    placeholder: 'Describe cualquier dificultad que hayas experimentado...',
    followUp: '¿En qué dispositivo ocurrió esto?'
  },
  general: {
    title: '¿Cómo podemos mejorar tu experiencia de meditación?',
    placeholder: 'Comparte cualquier pensamiento o sugerencia...',
    followUp: '¿Hay algo específico que te gustaría cambiar?'
  }
};

const SUGGESTED_FEATURES = [
  'Meditaciones con audio/voz',
  'Contenido para meditar sin internet',
  'Grupos de oración comunitarios',
  'Integración con calendario de la iglesia',
  'Contenido en inglés',
  'Meditaciones familiares/para niños',
  'Conexión directa con pastores',
  'Estudios bíblicos profundos'
];

export function FeedbackCollector({ onSubmit, trigger = 'manual' }: FeedbackCollectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<UserFeedback['type']>('spiritual_impact');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [followUpResponse, setFollowUpResponse] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = FEEDBACK_QUESTIONS[feedbackType];

  const handleSubmit = async () => {
    if (rating === 0 || message.trim() === '') return;

    setIsSubmitting(true);
    
    const feedback: UserFeedback = {
      type: feedbackType,
      rating,
      message: message.trim(),
      suggestions: followUpResponse.trim() || undefined,
      feature_priority: selectedFeatures.length > 0 ? selectedFeatures : undefined
    };

    try {
      // Save to database
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...feedback,
          trigger,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        onSubmit?.(feedback);
        setIsOpen(false);
        resetForm();
        
        // Show thank you message
        alert('¡Gracias por tu retroalimentación! Tu experiencia espiritual es muy importante para nosotros. 🙏');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Hubo un problema al enviar tu retroalimentación. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setMessage('');
    setFollowUpResponse('');
    setSelectedFeatures([]);
    setFeedbackType('spiritual_impact');
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 shadow-lg"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Compartir experiencia
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Tu experiencia espiritual</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Feedback Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              ¿Sobre qué te gustaría compartir?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(FEEDBACK_QUESTIONS).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setFeedbackType(type as UserFeedback['type'])}
                  className={`p-3 rounded-lg border text-sm text-left transition-all ${
                    feedbackType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {config.title.split('?')[0]}...
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Calificación general (1-5)
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      star <= rating
                        ? 'fill-current text-red-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Main Question */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {currentQuestion.title}
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={currentQuestion.placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Feature Priority (for feature requests) */}
          {feedbackType === 'feature_request' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                ¿Cuáles de estas características serían más útiles? (Selecciona todas las que apliquen)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED_FEATURES.map((feature) => (
                  <button
                    key={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    className={`p-2 rounded-lg border text-xs text-left transition-all ${
                      selectedFeatures.includes(feature)
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Question */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {currentQuestion.followUp}
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Comparte más detalles (opcional)..."
              value={followUpResponse}
              onChange={(e) => setFollowUpResponse(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || message.trim() === '' || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Enviando...' : 'Compartir experiencia'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Tu retroalimentación nos ayuda a crear una mejor experiencia espiritual para toda la comunidad. 🙏
          </p>
        </div>
      </Card>
    </div>
  );
}