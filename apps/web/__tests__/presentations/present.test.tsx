import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PresentationPage from '@/app/dashboard/presentations/present/[id]/page'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'

jest.mock('@/lib/supabase/client')
jest.mock('next/navigation')

// Mock fullscreen API
const mockRequestFullscreen = jest.fn()
const mockExitFullscreen = jest.fn()

Object.defineProperty(document.documentElement, 'requestFullscreen', {
  configurable: true,
  value: mockRequestFullscreen,
})

Object.defineProperty(document, 'exitFullscreen', {
  configurable: true,
  value: mockExitFullscreen,
})

describe('PresentationPage', () => {
  const mockPush = jest.fn()
  const mockService = {
    id: 'test-service-id',
    title: 'Servicio Dominical',
    date: '2024-01-01',
    slides: [
      {
        id: '1',
        type: 'song',
        content: {
          title: 'Amazing Grace',
          artist: 'John Newton',
          lyrics: 'Amazing grace how sweet the sound\\n\\nThat saved a wretch like me',
        },
      },
      {
        id: '2',
        type: 'scripture',
        content: {
          reference: 'Juan 3:16',
          text: 'Porque de tal manera amó Dios al mundo...',
          version: 'RVR1960',
        },
      },
      {
        id: '3',
        type: 'announcement',
        content: {
          title: 'Reunión de Oración',
          text: 'Este miércoles a las 7:00 PM',
        },
      },
    ],
  }
  
  beforeEach(() => {
    jest.clearAllMocks()
    
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    
    ;(useParams as jest.Mock).mockReturnValue({
      id: 'test-service-id',
    })
    
    const mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: mockService,
              error: null 
            })),
          })),
        })),
      })),
    };
    
    (createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it('renders loading state initially', () => {
    render(<PresentationPage />)
    
    expect(screen.getByText('Cargando presentación...')).toBeInTheDocument()
  })

  it('displays presentation after loading', async () => {
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Servicio Dominical')).toBeInTheDocument()
      expect(screen.getByText('Diapositiva 1 de 3')).toBeInTheDocument()
    })
  })

  it('renders first slide content correctly', async () => {
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
      expect(screen.getByText('John Newton')).toBeInTheDocument()
    })
  })

  it('navigates to next slide', async () => {
    const user = userEvent.setup()
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    const nextButton = screen.getByText('Siguiente')
    await user.click(nextButton)
    
    // Should show scripture slide
    expect(screen.getByText('Juan 3:16')).toBeInTheDocument()
    expect(screen.getByText('Porque de tal manera amó Dios al mundo...')).toBeInTheDocument()
    expect(screen.getByText('Diapositiva 2 de 3')).toBeInTheDocument()
  })

  it('navigates to previous slide', async () => {
    const user = userEvent.setup()
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    // Go to second slide
    await user.click(screen.getByText('Siguiente'))
    expect(screen.getByText('Juan 3:16')).toBeInTheDocument()
    
    // Go back to first slide
    await user.click(screen.getByText('Anterior'))
    expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    expect(screen.getByText('Diapositiva 1 de 3')).toBeInTheDocument()
  })

  it('disables previous button on first slide', async () => {
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    const previousButton = screen.getByText('Anterior')
    expect(previousButton).toBeDisabled()
  })

  it('disables next button on last slide', async () => {
    const user = userEvent.setup()
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    // Navigate to last slide
    await user.click(screen.getByText('Siguiente'))
    await user.click(screen.getByText('Siguiente'))
    
    expect(screen.getByText('Diapositiva 3 de 3')).toBeInTheDocument()
    const nextButton = screen.getByText('Siguiente')
    expect(nextButton).toBeDisabled()
  })

  it('responds to keyboard navigation', async () => {
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    // Press right arrow to go to next slide
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    
    await waitFor(() => {
      expect(screen.getByText('Juan 3:16')).toBeInTheDocument()
    })
    
    // Press left arrow to go back
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
  })

  it('enters fullscreen mode', async () => {
    const user = userEvent.setup()
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    const fullscreenButton = screen.getByText('Pantalla Completa')
    await user.click(fullscreenButton)
    
    expect(mockRequestFullscreen).toHaveBeenCalled()
  })

  it('exits fullscreen with ESC key', async () => {
    const user = userEvent.setup()
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    // Enter fullscreen
    await user.click(screen.getByText('Pantalla Completa'))
    
    // Press ESC
    fireEvent.keyDown(window, { key: 'Escape' })
    
    expect(mockExitFullscreen).toHaveBeenCalled()
  })

  it('navigates to slide using indicators', async () => {
    const user = userEvent.setup()
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    // Click on third slide indicator
    const indicators = screen.getAllByRole('button').filter(btn => 
      btn.className.includes('rounded-full')
    )
    
    await user.click(indicators[2])
    
    // Should show third slide
    expect(screen.getByText('Reunión de Oración')).toBeInTheDocument()
    expect(screen.getByText('Diapositiva 3 de 3')).toBeInTheDocument()
  })

  it('exits presentation', async () => {
    const user = userEvent.setup()
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    const exitButton = screen.getByText('Salir')
    await user.click(exitButton)
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/presentations')
  })

  it('handles missing service data', async () => {
    const mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: null,
              error: new Error('Not found') 
            })),
          })),
        })),
      })),
    };
    
    (createClient as jest.Mock).mockReturnValue(mockSupabase)
    
    render(<PresentationPage />)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard/presentations')
    })
  })
})