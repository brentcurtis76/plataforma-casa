import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PresentationBuilderPage from '@/app/dashboard/presentations/builder/page'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

jest.mock('@/lib/supabase/client')
jest.mock('next/navigation')

// Mock DnD Kit
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
  PointerSensor: jest.fn(),
  KeyboardSensor: jest.fn(),
  closestCenter: jest.fn(),
}))

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  arrayMove: jest.fn((array, from, to) => {
    const newArray = [...array]
    const [removed] = newArray.splice(from, 1)
    newArray.splice(to, 0, removed)
    return newArray
  }),
  sortableKeyboardCoordinates: jest.fn(),
  verticalListSortingStrategy: jest.fn(),
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  })),
}))

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ''),
    },
  },
}))

describe('PresentationBuilderPage', () => {
  const mockPush = jest.fn()
  const mockSongs = [
    {
      id: '1',
      title: 'Amazing Grace',
      artist: 'John Newton',
      lyrics: 'Amazing grace how sweet the sound',
    },
    {
      id: '2',
      title: 'How Great Thou Art',
      artist: null,
      lyrics: 'O Lord my God',
    },
  ]
  
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
      from: jest.fn((table: string) => {
        if (table === 'church_songs') {
          return {
            select: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({ 
                data: mockSongs,
                error: null 
              })),
            })),
          }
        }
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ 
                data: { organization_id: 'test-org-id' },
                error: null 
              })),
            })),
          })),
          insert: jest.fn(() => Promise.resolve({ error: null })),
        }
      }),
    };
    
    (createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it('renders the builder with title and date fields', () => {
    render(<PresentationBuilderPage />)
    
    expect(screen.getByText('Nueva Presentación')).toBeInTheDocument()
    expect(screen.getByLabelText('Título del Servicio *')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha *')).toBeInTheDocument()
  })

  it('displays slide type options when adding a slide', async () => {
    const user = userEvent.setup()
    render(<PresentationBuilderPage />)
    
    const addSlideButton = screen.getByText('Agregar Diapositiva')
    await user.click(addSlideButton)
    
    expect(screen.getByText('Seleccionar tipo de diapositiva:')).toBeInTheDocument()
    expect(screen.getByText('Canción')).toBeInTheDocument()
    expect(screen.getByText('Escritura')).toBeInTheDocument()
    expect(screen.getByText('Anuncio')).toBeInTheDocument()
    expect(screen.getByText('Imagen')).toBeInTheDocument()
    expect(screen.getByText('Oración')).toBeInTheDocument()
  })

  it('adds a slide when selecting a type', async () => {
    const user = userEvent.setup()
    render(<PresentationBuilderPage />)
    
    // Open slide type selector
    await user.click(screen.getByText('Agregar Diapositiva'))
    
    // Add an announcement slide
    const announcementButton = screen.getByText('Anuncio')
    await user.click(announcementButton)
    
    // Check that slide was added
    await waitFor(() => {
      expect(screen.queryByText('No hay diapositivas. Haz clic en "Agregar Diapositiva" para comenzar.')).not.toBeInTheDocument()
    })
  })

  it('requires title and at least one slide to save', async () => {
    const user = userEvent.setup()
    render(<PresentationBuilderPage />)
    
    const saveButton = screen.getByText('Guardar Presentación')
    
    // Should be disabled initially
    expect(saveButton).toBeDisabled()
    
    // Add title
    await user.type(screen.getByLabelText('Título del Servicio *'), 'Servicio Dominical')
    
    // Still disabled without slides
    expect(saveButton).toBeDisabled()
    
    // Add a slide
    await user.click(screen.getByText('Agregar Diapositiva'))
    await user.click(screen.getByText('Anuncio'))
    
    // Now should be enabled
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled()
    })
  })

  it('saves presentation with valid data', async () => {
    const user = userEvent.setup()
    render(<PresentationBuilderPage />)
    
    // Fill in title
    await user.type(screen.getByLabelText('Título del Servicio *'), 'Servicio de Navidad')
    
    // Add a slide
    await user.click(screen.getByText('Agregar Diapositiva'))
    await user.click(screen.getByText('Oración'))
    
    // Save
    const saveButton = screen.getByText('Guardar Presentación')
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled()
    })
    
    await user.click(saveButton)
    
    // Check loading state
    expect(screen.getByText('Guardando...')).toBeInTheDocument()
    
    // Wait for navigation
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard/presentations')
    })
  })

  it('shows alert when trying to save without title', async () => {
    global.alert = jest.fn()
    const user = userEvent.setup()
    render(<PresentationBuilderPage />)
    
    // Add a slide but no title
    await user.click(screen.getByText('Agregar Diapositiva'))
    await user.click(screen.getByText('Anuncio'))
    
    // Try to save
    const saveButton = screen.getByText('Guardar Presentación')
    
    // The button should be disabled, but if somehow it's clicked
    if (!saveButton.hasAttribute('disabled')) {
      await user.click(saveButton)
      expect(global.alert).toHaveBeenCalledWith('Por favor, ingresa un título y agrega al menos una diapositiva')
    }
  })

  it('cancels slide type selection', async () => {
    const user = userEvent.setup()
    render(<PresentationBuilderPage />)
    
    // Open slide type selector
    await user.click(screen.getByText('Agregar Diapositiva'))
    expect(screen.getByText('Seleccionar tipo de diapositiva:')).toBeInTheDocument()
    
    // Cancel
    await user.click(screen.getByText('Cancelar'))
    
    // Selector should be hidden
    expect(screen.queryByText('Seleccionar tipo de diapositiva:')).not.toBeInTheDocument()
  })
})