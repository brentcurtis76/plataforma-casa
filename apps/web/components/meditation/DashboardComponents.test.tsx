import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardRecommendations, DashboardQuickMeditation, DashboardGreeting } from './DashboardComponents';

describe('DashboardRecommendations', () => {
  const mockRecommendations = [
    { emotion: 'peace', reason: 'Encuentro con Dios' },
    { emotion: 'hope', reason: 'Nuevo día' },
    { emotion: 'gratitude', reason: 'Tiempo de reflexión' }
  ];

  const mockOnSelectEmotion = vi.fn();

  it('should render recommendations correctly', () => {
    render(
      <DashboardRecommendations 
        recommendations={mockRecommendations}
        onSelectEmotion={mockOnSelectEmotion}
      />
    );

    expect(screen.getByText('Sugerencias para ti:')).toBeInTheDocument();
    expect(screen.getByText('Paz')).toBeInTheDocument();
    expect(screen.getByText('Esperanza')).toBeInTheDocument();
    expect(screen.getByText('Gratitud')).toBeInTheDocument();
  });

  it('should highlight the first recommendation', () => {
    render(
      <DashboardRecommendations 
        recommendations={mockRecommendations}
        onSelectEmotion={mockOnSelectEmotion}
      />
    );

    const firstRecommendation = screen.getByText('Paz').closest('button');
    expect(firstRecommendation).toHaveClass('ring-2', 'ring-blue-300');
  });

  it('should call onSelectEmotion when recommendation is clicked', () => {
    render(
      <DashboardRecommendations 
        recommendations={mockRecommendations}
        onSelectEmotion={mockOnSelectEmotion}
      />
    );

    fireEvent.click(screen.getByText('Paz'));
    expect(mockOnSelectEmotion).toHaveBeenCalledWith('peace');
  });

  it('should show explore more options link', () => {
    render(
      <DashboardRecommendations 
        recommendations={mockRecommendations}
        onSelectEmotion={mockOnSelectEmotion}
      />
    );

    const exploreLink = screen.getByText('¿Sientes algo diferente? Explora más opciones');
    expect(exploreLink).toBeInTheDocument();
    
    fireEvent.click(exploreLink);
    expect(mockOnSelectEmotion).toHaveBeenCalledWith('');
  });

  it('should render loading state', () => {
    render(
      <DashboardRecommendations 
        recommendations={[]}
        onSelectEmotion={mockOnSelectEmotion}
        loading={true}
      />
    );

    expect(screen.getByTestId('loading-skeleton') || screen.getByText('', { selector: '.animate-pulse' })).toBeInTheDocument();
  });

  it('should use spiritual language and icons', () => {
    render(
      <DashboardRecommendations 
        recommendations={mockRecommendations}
        onSelectEmotion={mockOnSelectEmotion}
      />
    );

    // Should show dove icon for spiritual context
    expect(screen.getByText('🕊️')).toBeInTheDocument();
    
    // Should show spiritual reasons
    expect(screen.getByText('Encuentro con Dios')).toBeInTheDocument();
  });
});

describe('DashboardQuickMeditation', () => {
  const mockOnStart = vi.fn();

  it('should render quick meditation for returning users', () => {
    render(
      <DashboardQuickMeditation 
        lastEmotion="peace"
        streak={5}
        onStart={mockOnStart}
      />
    );

    expect(screen.getByText('Continuar con')).toBeInTheDocument();
    expect(screen.getByText('Paz')).toBeInTheDocument();
    expect(screen.getByText('5 días en oración')).toBeInTheDocument();
  });

  it('should use spiritual language for streaks', () => {
    render(
      <DashboardQuickMeditation 
        lastEmotion="peace"
        streak={1}
        onStart={mockOnStart}
      />
    );

    expect(screen.getByText('1 día en oración')).toBeInTheDocument();
    expect(screen.queryByText('racha')).not.toBeInTheDocument();
    expect(screen.queryByText('🔥')).not.toBeInTheDocument();
  });

  it('should call onStart when continue button is clicked', () => {
    render(
      <DashboardQuickMeditation 
        lastEmotion="peace"
        streak={5}
        onStart={mockOnStart}
      />
    );

    fireEvent.click(screen.getByText('Continuar meditando'));
    expect(mockOnStart).toHaveBeenCalledWith('peace');
  });

  it('should not render when no last emotion', () => {
    const { container } = render(
      <DashboardQuickMeditation 
        lastEmotion={null}
        streak={0}
        onStart={mockOnStart}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render when loading', () => {
    const { container } = render(
      <DashboardQuickMeditation 
        lastEmotion="peace"
        streak={5}
        onStart={mockOnStart}
        loading={true}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

describe('DashboardGreeting', () => {
  const mockGreeting = {
    greeting: 'Buenos días',
    icon: '☀️',
    message: 'Comienza tu día con oración'
  };

  it('should render greeting correctly', () => {
    render(<DashboardGreeting greeting={mockGreeting} />);

    expect(screen.getByText('Buenos días')).toBeInTheDocument();
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.getByText('Comienza tu día con oración')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(<DashboardGreeting greeting={mockGreeting} loading={true} />);

    expect(screen.getByRole('generic')).toHaveClass('animate-pulse');
    expect(screen.queryByText('Buenos días')).not.toBeInTheDocument();
  });

  it('should have proper text hierarchy', () => {
    render(<DashboardGreeting greeting={mockGreeting} />);

    const heading = screen.getByText('Buenos días');
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('should center content properly', () => {
    render(<DashboardGreeting greeting={mockGreeting} />);

    const container = screen.getByText('Buenos días').closest('div');
    expect(container).toHaveClass('text-center');
  });
});