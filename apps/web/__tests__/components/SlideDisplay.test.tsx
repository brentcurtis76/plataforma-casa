import { render, screen } from '@testing-library/react'

// Simple component to test slide rendering logic
function SlideDisplay({ slide, fullscreen = false }: { slide: any, fullscreen?: boolean }) {
  const baseClass = fullscreen 
    ? "flex items-center justify-center h-screen p-16 text-white" 
    : "flex items-center justify-center h-[600px] p-12 text-gray-900"

  switch (slide.type) {
    case 'song':
      return (
        <div className={`${baseClass} text-center`} data-testid="song-slide">
          <div>
            <h2 className="text-5xl font-bold mb-8">{slide.content.title}</h2>
            {slide.content.artist && (
              <p className="text-2xl mb-8 opacity-75">{slide.content.artist}</p>
            )}
            <div className="text-3xl leading-relaxed whitespace-pre-wrap">
              {slide.content.lyrics}
            </div>
          </div>
        </div>
      )

    case 'scripture':
      return (
        <div className={`${baseClass} text-center`} data-testid="scripture-slide">
          <div>
            <h2 className="text-4xl font-bold mb-8">{slide.content.reference}</h2>
            <p className="text-3xl leading-relaxed max-w-4xl mx-auto">
              {slide.content.text}
            </p>
            {slide.content.version && (
              <p className="text-xl mt-8 opacity-75">{slide.content.version}</p>
            )}
          </div>
        </div>
      )

    case 'announcement':
      return (
        <div className={`${baseClass} text-center`} data-testid="announcement-slide">
          <div>
            <h2 className="text-5xl font-bold mb-8">{slide.content.title || 'Anuncio'}</h2>
            <p className="text-3xl leading-relaxed max-w-4xl mx-auto">
              {slide.content.text}
            </p>
          </div>
        </div>
      )

    default:
      return null
  }
}

describe('SlideDisplay', () => {
  it('renders song slide correctly', () => {
    const songSlide = {
      type: 'song',
      content: {
        title: 'Amazing Grace',
        artist: 'John Newton',
        lyrics: 'Amazing grace how sweet the sound',
      },
    }

    render(<SlideDisplay slide={songSlide} />)

    expect(screen.getByTestId('song-slide')).toBeInTheDocument()
    expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    expect(screen.getByText('John Newton')).toBeInTheDocument()
    expect(screen.getByText('Amazing grace how sweet the sound')).toBeInTheDocument()
  })

  it('renders song slide without artist', () => {
    const songSlide = {
      type: 'song',
      content: {
        title: 'Worship Song',
        lyrics: 'Lyrics here',
      },
    }

    render(<SlideDisplay slide={songSlide} />)

    expect(screen.getByText('Worship Song')).toBeInTheDocument()
    expect(screen.queryByText('John Newton')).not.toBeInTheDocument()
  })

  it('renders scripture slide correctly', () => {
    const scriptureSlide = {
      type: 'scripture',
      content: {
        reference: 'Juan 3:16',
        text: 'Porque de tal manera amó Dios al mundo...',
        version: 'RVR1960',
      },
    }

    render(<SlideDisplay slide={scriptureSlide} />)

    expect(screen.getByTestId('scripture-slide')).toBeInTheDocument()
    expect(screen.getByText('Juan 3:16')).toBeInTheDocument()
    expect(screen.getByText('Porque de tal manera amó Dios al mundo...')).toBeInTheDocument()
    expect(screen.getByText('RVR1960')).toBeInTheDocument()
  })

  it('renders announcement slide correctly', () => {
    const announcementSlide = {
      type: 'announcement',
      content: {
        title: 'Reunión de Oración',
        text: 'Este miércoles a las 7:00 PM',
      },
    }

    render(<SlideDisplay slide={announcementSlide} />)

    expect(screen.getByTestId('announcement-slide')).toBeInTheDocument()
    expect(screen.getByText('Reunión de Oración')).toBeInTheDocument()
    expect(screen.getByText('Este miércoles a las 7:00 PM')).toBeInTheDocument()
  })

  it('renders default announcement title when not provided', () => {
    const announcementSlide = {
      type: 'announcement',
      content: {
        text: 'Important announcement text',
      },
    }

    render(<SlideDisplay slide={announcementSlide} />)

    expect(screen.getByText('Anuncio')).toBeInTheDocument()
    expect(screen.getByText('Important announcement text')).toBeInTheDocument()
  })

  it('applies fullscreen styles when fullscreen prop is true', () => {
    const songSlide = {
      type: 'song',
      content: {
        title: 'Test Song',
        lyrics: 'Test lyrics',
      },
    }

    render(<SlideDisplay slide={songSlide} fullscreen={true} />)

    const slideElement = screen.getByTestId('song-slide')
    expect(slideElement).toHaveClass('text-white')
    expect(slideElement).toHaveClass('h-screen')
  })

  it('applies normal styles when fullscreen prop is false', () => {
    const songSlide = {
      type: 'song',
      content: {
        title: 'Test Song',
        lyrics: 'Test lyrics',
      },
    }

    render(<SlideDisplay slide={songSlide} fullscreen={false} />)

    const slideElement = screen.getByTestId('song-slide')
    expect(slideElement).toHaveClass('text-gray-900')
    expect(slideElement).toHaveClass('h-[600px]')
  })

  it('returns null for unknown slide type', () => {
    const unknownSlide = {
      type: 'unknown',
      content: {},
    }

    const { container } = render(<SlideDisplay slide={unknownSlide} />)

    expect(container.firstChild).toBeNull()
  })
})