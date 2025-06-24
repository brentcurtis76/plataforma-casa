import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewSongPage from '@/app/dashboard/presentations/songs/new/page'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

jest.mock('@/lib/supabase/client')
jest.mock('next/navigation')

describe('NewSongPage', () => {
  const mockPush = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    
    const mockSupabase = {
      auth: {
        getUser: jest.fn(() => Promise.resolve({ 
          data: { user: { id: 'test-user-id' } } 
        })),
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: { organization_id: 'test-org-id' },
              error: null 
            })),
          })),
        })),
        insert: jest.fn(() => Promise.resolve({ error: null })),
      })),
    };
    
    (createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it('renders the form with all fields', () => {
    render(<NewSongPage />)
    
    expect(screen.getByText('Nueva Canción')).toBeInTheDocument()
    expect(screen.getByLabelText('Título *')).toBeInTheDocument()
    expect(screen.getByLabelText('Artista/Autor')).toBeInTheDocument()
    expect(screen.getByLabelText('Letra *')).toBeInTheDocument()
    expect(screen.getByText('Guardar Canción')).toBeInTheDocument()
  })

  it('requires title and lyrics fields', async () => {
    const user = userEvent.setup()
    render(<NewSongPage />)
    
    const submitButton = screen.getByText('Guardar Canción')
    
    // Button should be disabled when fields are empty
    expect(submitButton).toBeDisabled()
    
    // Fill in title
    await user.type(screen.getByLabelText('Título *'), 'Test Song')
    expect(submitButton).toBeDisabled()
    
    // Fill in lyrics
    await user.type(screen.getByLabelText('Letra *'), 'Test lyrics')
    expect(submitButton).not.toBeDisabled()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<NewSongPage />)
    
    // Fill in form
    await user.type(screen.getByLabelText('Título *'), 'Amazing Grace')
    await user.type(screen.getByLabelText('Artista/Autor'), 'John Newton')
    await user.type(screen.getByLabelText('Letra *'), 'Amazing grace how sweet the sound\\n\\nThat saved a wretch like me')
    
    // Submit form
    const submitButton = screen.getByText('Guardar Canción')
    await user.click(submitButton)
    
    // Check loading state
    expect(screen.getByText('Guardando...')).toBeInTheDocument()
    
    // Wait for navigation
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard/presentations/songs')
    })
    
    // Verify Supabase calls
    const mockSupabase = (createClient as jest.Mock).mock.results[0].value
    expect(mockSupabase.from).toHaveBeenCalledWith('church_songs')
  })

  it('displays error when user is not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn(() => Promise.resolve({ 
          data: { user: null } 
        })),
      },
    };
    
    (createClient as jest.Mock).mockReturnValue(mockSupabase)
    
    // Mock window.alert
    global.alert = jest.fn()
    
    const user = userEvent.setup()
    render(<NewSongPage />)
    
    await user.type(screen.getByLabelText('Título *'), 'Test Song')
    await user.type(screen.getByLabelText('Letra *'), 'Test lyrics')
    
    const submitButton = screen.getByText('Guardar Canción')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Error al crear la canción')
    })
  })

  it('handles database errors gracefully', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn(() => Promise.resolve({ 
          data: { user: { id: 'test-user-id' } } 
        })),
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: { organization_id: 'test-org-id' },
              error: null 
            })),
          })),
        })),
        insert: jest.fn(() => Promise.resolve({ 
          error: new Error('Database error') 
        })),
      })),
    };
    
    (createClient as jest.Mock).mockReturnValue(mockSupabase)
    global.alert = jest.fn()
    
    const user = userEvent.setup()
    render(<NewSongPage />)
    
    await user.type(screen.getByLabelText('Título *'), 'Test Song')
    await user.type(screen.getByLabelText('Letra *'), 'Test lyrics')
    
    const submitButton = screen.getByText('Guardar Canción')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Error al crear la canción')
    })
  })
})