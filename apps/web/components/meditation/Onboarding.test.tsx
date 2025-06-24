import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { Onboarding, useOnboarding } from './Onboarding';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('useOnboarding hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show onboarding for first-time users', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.showOnboarding).toBe(true);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('meditation_onboarding_completed');
  });

  it('should hide onboarding for returning users', () => {
    mockLocalStorage.getItem.mockReturnValue('true');

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.showOnboarding).toBe(false);
  });

  it('should complete onboarding and persist to localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.showOnboarding).toBe(true);

    act(() => {
      result.current.completeOnboarding();
    });

    expect(result.current.showOnboarding).toBe(false);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('meditation_onboarding_completed', 'true');
  });
});

describe('Onboarding component', () => {
  const mockOnComplete = vi.fn();
  const mockOnSkip = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render first step by default', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    expect(screen.getByText('Bienvenido a Meditación Guiada')).toBeInTheDocument();
    expect(screen.getByText(/personalizadas/i)).toBeInTheDocument();
    expect(screen.getByText('1 de 5')).toBeInTheDocument();
  });

  it('should navigate through all 5 steps', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    // Step 1
    expect(screen.getByText('1 de 5')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 2
    expect(screen.getByText('2 de 5')).toBeInTheDocument();
    expect(screen.getByText(/Escritura/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 3
    expect(screen.getByText('3 de 5')).toBeInTheDocument();
    expect(screen.getByText(/meditación/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 4
    expect(screen.getByText('4 de 5')).toBeInTheDocument();
    expect(screen.getByText(/feedback/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 5
    expect(screen.getByText('5 de 5')).toBeInTheDocument();
    expect(screen.getByText(/diario/i)).toBeInTheDocument();
  });

  it('should complete onboarding on final step', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    // Navigate to final step
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText('Siguiente'));
    }

    // Complete onboarding
    fireEvent.click(screen.getByText('Comenzar'));
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('should allow skipping onboarding', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    fireEvent.click(screen.getByText('Omitir'));
    expect(mockOnSkip).toHaveBeenCalled();
  });

  it('should navigate backwards through steps', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    // Go to step 2
    fireEvent.click(screen.getByText('Siguiente'));
    expect(screen.getByText('2 de 5')).toBeInTheDocument();

    // Go back to step 1
    fireEvent.click(screen.getByText('Anterior'));
    expect(screen.getByText('1 de 5')).toBeInTheDocument();
  });

  it('should not show previous button on first step', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
  });

  it('should show proper button text on final step', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    // Navigate to final step
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText('Siguiente'));
    }

    expect(screen.getByText('Comenzar')).toBeInTheDocument();
    expect(screen.queryByText('Siguiente')).not.toBeInTheDocument();
  });

  it('should have proper ARIA attributes for accessibility', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('aria-labelledby');
  });

  it('should close on escape key', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });
    expect(mockOnSkip).toHaveBeenCalled();
  });

  it('should use spiritual language throughout', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    // Check for spiritual terms across all steps
    expect(screen.getByText(/Dios/i)).toBeInTheDocument();
    
    // Navigate through steps to check spiritual language
    fireEvent.click(screen.getByText('Siguiente'));
    expect(screen.getByText(/Escritura/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Siguiente'));
    expect(screen.getByText(/oración/i)).toBeInTheDocument();
  });

  it('should show progress indicator correctly', () => {
    render(<Onboarding onComplete={mockOnComplete} onSkip={mockOnSkip} />);

    // Check initial progress
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '20'); // 1/5 = 20%

    // Navigate and check progress updates
    fireEvent.click(screen.getByText('Siguiente'));
    expect(progressBar).toHaveAttribute('aria-valuenow', '40'); // 2/5 = 40%
  });
});