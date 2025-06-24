import { useState, useEffect } from 'react';
import { Button, Card } from '@church-admin/ui';
import { AlertTriangle, RefreshCw, WifiOff, Clock, Bug } from 'lucide-react';

interface ErrorType {
  type: 'network' | 'api' | 'generation' | 'timeout' | 'unknown';
  message: string;
  details?: string;
  retryable: boolean;
  suggestion?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export function ErrorBoundary({ children, fallback: Fallback }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(new Error(event.reason?.message || 'Unhandled promise rejection'));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const retry = () => {
    setError(null);
    window.location.reload();
  };

  if (error) {
    if (Fallback) {
      return <Fallback error={error} retry={retry} />;
    }
    return <ErrorDisplay error={error} onRetry={retry} />;
  }

  return <>{children}</>;
}

// Enhanced error classification
export function classifyError(error: any): ErrorType {
  const message = error?.message?.toLowerCase() || '';
  
  // Network errors
  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return {
      type: 'network',
      message: 'Error de conexión',
      details: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      retryable: true,
      suggestion: 'Intenta de nuevo en unos momentos o verifica tu conexión a internet.'
    };
  }

  // API errors
  if (message.includes('api') || message.includes('failed to') || error?.status) {
    return {
      type: 'api',
      message: 'Error del servidor',
      details: `El servidor respondió con un error (${error?.status || 'unknown'}).`,
      retryable: true,
      suggestion: 'Este error suele ser temporal. Intenta de nuevo en unos momentos.'
    };
  }

  // Generation errors (AI/audio)
  if (message.includes('generation') || message.includes('openai') || message.includes('eleven')) {
    return {
      type: 'generation',
      message: 'Error generando contenido',
      details: 'No se pudo generar el contenido de meditación personalizado.',
      retryable: true,
      suggestion: 'Tenemos contenido de respaldo disponible, o puedes intentar de nuevo.'
    };
  }

  // Timeout errors
  if (message.includes('timeout') || message.includes('time')) {
    return {
      type: 'timeout',
      message: 'Tiempo de espera agotado',
      details: 'La operación tardó más de lo esperado.',
      retryable: true,
      suggestion: 'Esto puede ocurrir cuando hay mucha demanda. Intenta de nuevo.'
    };
  }

  // Generic/unknown errors
  return {
    type: 'unknown',
    message: 'Algo salió mal',
    details: error?.message || 'Ocurrió un error inesperado.',
    retryable: true,
    suggestion: 'Intenta recargar la página o contacta soporte si el problema persiste.'
  };
}

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
  onFallback?: () => void;
  retryCount?: number;
}

export function ErrorDisplay({ error, onRetry, onFallback, retryCount = 0 }: ErrorDisplayProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const errorInfo = classifyError(error);
  
  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const getIcon = () => {
    switch (errorInfo.type) {
      case 'network':
        return <WifiOff className="h-12 w-12 text-red-500" />;
      case 'timeout':
        return <Clock className="h-12 w-12 text-orange-500" />;
      case 'generation':
        return <Bug className="h-12 w-12 text-purple-500" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-red-500" />;
    }
  };

  const maxRetries = 3;
  const canRetry = errorInfo.retryable && retryCount < maxRetries;

  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="mb-6">
        {getIcon()}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{errorInfo.message}</h3>
      <p className="text-gray-600 mb-4">{errorInfo.details}</p>
      
      {errorInfo.suggestion && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800">{errorInfo.suggestion}</p>
        </div>
      )}

      {retryCount > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          Intento {retryCount} de {maxRetries}
        </p>
      )}

      <div className="flex gap-3 justify-center">
        {canRetry && onRetry && (
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Intentando...' : 'Reintentar'}
          </Button>
        )}
        
        {onFallback && (
          <Button
            variant="outline"
            onClick={onFallback}
          >
            Usar contenido de respaldo
          </Button>
        )}
        
        {!canRetry && (
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Recargar página
          </Button>
        )}
      </div>

      {retryCount >= maxRetries && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Si el problema persiste, puedes{' '}
            <button 
              className="underline font-medium"
              onClick={() => {
                const subject = encodeURIComponent('Error en Meditación Guiada');
                const body = encodeURIComponent(`
Error: ${errorInfo.message}
Detalles: ${errorInfo.details}
Tipo: ${errorInfo.type}
Navegador: ${navigator.userAgent}
Fecha: ${new Date().toISOString()}
                `);
                window.open(`mailto:soporte@example.com?subject=${subject}&body=${body}`);
              }}
            >
              contactar soporte
            </button>{' '}
            o intentar más tarde.
          </p>
        </div>
      )}
    </Card>
  );
}

// Hook for retry logic with exponential backoff
export function useRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    onError?: (error: Error, attempt: number) => void;
  } = {}
) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    onError
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const execute = async (): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        setRetryCount(0);
        setIsLoading(false);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        
        if (onError) {
          onError(error, attempt + 1);
        }

        if (attempt === maxRetries) {
          setError(error);
          setRetryCount(attempt + 1);
          setIsLoading(false);
          throw error;
        }

        // Exponential backoff with jitter
        const delay = Math.min(
          baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
          maxDelay
        );
        
        setRetryCount(attempt + 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    setIsLoading(false);
    return null;
  };

  const retry = () => {
    setRetryCount(0);
    return execute();
  };

  return {
    execute,
    retry,
    isLoading,
    error,
    retryCount
  };
}

// Optimistic retry for common operations
export function OptimisticAction({ 
  children, 
  onAction, 
  successMessage,
  errorMessage 
}: {
  children: React.ReactNode;
  onAction: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<Error | null>(null);

  const { execute, retry, retryCount } = useRetry(onAction, {
    onError: (err, attempt) => {
      console.error(`Action failed (attempt ${attempt}):`, err);
      setError(err);
      setStatus('error');
    }
  });

  const handleAction = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      await execute();
      setStatus('success');
      
      if (successMessage) {
        // Show success toast or notification
        console.log(successMessage);
      }
      
      // Reset status after success
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  if (status === 'error' && error) {
    return (
      <ErrorDisplay 
        error={error} 
        onRetry={retry}
        retryCount={retryCount}
      />
    );
  }

  return (
    <div onClick={handleAction}>
      {children}
    </div>
  );
}

// Network status indicator
export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-50">
      <WifiOff className="inline h-4 w-4 mr-2" />
      Sin conexión a internet. Algunas funciones pueden no estar disponibles.
    </div>
  );
}