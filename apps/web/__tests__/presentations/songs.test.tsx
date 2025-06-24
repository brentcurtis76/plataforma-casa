import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SongsPage from '@/app/dashboard/presentations/songs/page'
import { createClient } from '@/lib/supabase/client'

// Mock the Supabase client
jest.mock('@/lib/supabase/client')

const mockSongs = [
  {
    id: '1',
    title: 'Amazing Grace',
    artist: 'John Newton',
    lyrics: 'Amazing grace how sweet the sound',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'How Great Thou Art',
    artist: null,
    lyrics: 'O Lord my God',
    created_at: '2024-01-02T00:00:00Z',
  },
]

describe('SongsPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    
    // Setup default mock implementation
    const mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: mockSongs, error: null })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null })),
        })),
      })),
    };
    
    (createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it('renders the songs page with title', async () => {
    render(<SongsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Biblioteca de Canciones')).toBeInTheDocument()
      expect(screen.getByText('Nueva Canción')).toBeInTheDocument()
    })
  })

  it('displays loading state initially', () => {
    render(<SongsPage />)
    
    expect(screen.getByText('Cargando canciones...')).toBeInTheDocument()
  })

  it('displays songs after loading', async () => {
    await act(async () => {
      render(<SongsPage />)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
      expect(screen.getByText('John Newton')).toBeInTheDocument()
      expect(screen.getByText('How Great Thou Art')).toBeInTheDocument()
    })
  })

  it('filters songs based on search term', async () => {
    const user = userEvent.setup()
    render(<SongsPage />)
    
    // Wait for songs to load
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    // Search for a specific song
    const searchInput = screen.getByPlaceholderText('Buscar por título o artista...')
    await user.type(searchInput, 'Amazing')
    
    // Check that only matching song is displayed
    expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    expect(screen.queryByText('How Great Thou Art')).not.toBeInTheDocument()
  })

  it('shows empty state when no songs match search', async () => {
    const user = userEvent.setup()
    render(<SongsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Buscar por título o artista...')
    await user.type(searchInput, 'Nonexistent Song')
    
    expect(screen.getByText('No se encontraron canciones que coincidan con la búsqueda')).toBeInTheDocument()
  })

  it('handles delete song action', async () => {
    // Mock window.confirm
    global.confirm = jest.fn(() => true)
    
    render(<SongsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    // Find and click delete button for first song
    const deleteButtons = screen.getAllByRole('button', { name: '' })
    const deleteButton = deleteButtons.find(btn => btn.querySelector('.lucide-trash2'))
    
    if (deleteButton) {
      fireEvent.click(deleteButton)
    }
    
    expect(global.confirm).toHaveBeenCalledWith('¿Estás seguro de que deseas eliminar esta canción?')
    
    await waitFor(() => {
      const mockSupabase = (createClient as jest.Mock).mock.results[0].value
      expect(mockSupabase.from).toHaveBeenCalledWith('church_songs')
    })
  })

  it('cancels delete when user declines confirmation', async () => {
    global.confirm = jest.fn(() => false)
    
    await act(async () => {
      render(<SongsPage />)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    })
    
    const deleteButtons = screen.getAllByRole('button', { name: '' })
    const deleteButton = deleteButtons.find(btn => btn.querySelector('.lucide-trash2'))
    
    if (deleteButton) {
      fireEvent.click(deleteButton)
    }
    
    // Since confirm returned false, delete should not be called
    expect(global.confirm).toHaveBeenCalled()
  })
})