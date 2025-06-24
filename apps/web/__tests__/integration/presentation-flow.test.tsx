import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock data for testing
const mockPresentationData = {
  slides: [
    {
      id: '1',
      type: 'song',
      content: {
        title: 'Opening Song',
        lyrics: 'Verse 1 lyrics here',
      },
    },
    {
      id: '2',
      type: 'scripture',
      content: {
        reference: 'Psalm 23',
        text: 'The Lord is my shepherd',
      },
    },
    {
      id: '3',
      type: 'announcement',
      content: {
        title: 'Weekly Meeting',
        text: 'Join us on Wednesday',
      },
    },
  ],
}

// Simple presentation viewer component for testing
function SimplePresentationViewer({ slides }: { slides: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') previousSlide()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlide])

  const slide = slides[currentSlide]

  if (!slide) {
    return (
      <div>
        <div data-testid="slide-counter">
          Slide {currentSlide + 1} of {slides.length}
        </div>
        <div data-testid="slide-content"></div>
      </div>
    )
  }

  return (
    <div>
      <div data-testid="slide-counter">
        Slide {currentSlide + 1} of {slides.length}
      </div>
      
      <div data-testid="slide-content">
        {slide.type === 'song' && (
          <div>
            <h2>{slide.content.title}</h2>
            <p>{slide.content.lyrics}</p>
          </div>
        )}
        {slide.type === 'scripture' && (
          <div>
            <h2>{slide.content.reference}</h2>
            <p>{slide.content.text}</p>
          </div>
        )}
        {slide.type === 'announcement' && (
          <div>
            <h2>{slide.content.title}</h2>
            <p>{slide.content.text}</p>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={previousSlide}
          disabled={currentSlide === 0}
          data-testid="prev-button"
        >
          Previous
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          data-testid="next-button"
        >
          Next
        </button>
      </div>

      <div data-testid="slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            data-testid={`indicator-${index}`}
            className={currentSlide === index ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

// Add missing imports
import { useState, useEffect } from 'react'

describe('Presentation Flow Integration', () => {
  it('navigates through slides using buttons', async () => {
    const user = userEvent.setup()
    render(<SimplePresentationViewer slides={mockPresentationData.slides} />)

    // Initially on first slide
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('Slide 1 of 3')
    expect(screen.getByText('Opening Song')).toBeInTheDocument()

    // Navigate to second slide
    await user.click(screen.getByTestId('next-button'))
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('Slide 2 of 3')
    expect(screen.getByText('Psalm 23')).toBeInTheDocument()

    // Navigate to third slide
    await user.click(screen.getByTestId('next-button'))
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('Slide 3 of 3')
    expect(screen.getByText('Weekly Meeting')).toBeInTheDocument()

    // Navigate back
    await user.click(screen.getByTestId('prev-button'))
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('Slide 2 of 3')
  })

  it('disables navigation buttons at boundaries', () => {
    render(<SimplePresentationViewer slides={mockPresentationData.slides} />)

    // Previous button disabled on first slide
    expect(screen.getByTestId('prev-button')).toBeDisabled()
    expect(screen.getByTestId('next-button')).not.toBeDisabled()
  })

  it('navigates using keyboard arrows', () => {
    render(<SimplePresentationViewer slides={mockPresentationData.slides} />)

    // Initially on first slide
    expect(screen.getByText('Opening Song')).toBeInTheDocument()

    // Press right arrow
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('Psalm 23')).toBeInTheDocument()

    // Press right arrow again
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('Weekly Meeting')).toBeInTheDocument()

    // Press left arrow
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('Psalm 23')).toBeInTheDocument()
  })

  it('jumps to specific slide using indicators', async () => {
    const user = userEvent.setup()
    render(<SimplePresentationViewer slides={mockPresentationData.slides} />)

    // Click on third indicator
    await user.click(screen.getByTestId('indicator-2'))
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('Slide 3 of 3')
    expect(screen.getByText('Weekly Meeting')).toBeInTheDocument()

    // Click on first indicator
    await user.click(screen.getByTestId('indicator-0'))
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('Slide 1 of 3')
    expect(screen.getByText('Opening Song')).toBeInTheDocument()
  })

  it('handles empty slides array gracefully', () => {
    render(<SimplePresentationViewer slides={[]} />)
    
    expect(screen.getByTestId('slide-counter')).toHaveTextContent('Slide 1 of 0')
    // No content should be displayed
    expect(screen.getByTestId('slide-content')).toBeEmptyDOMElement()
  })

  it('updates button states correctly during navigation', async () => {
    const user = userEvent.setup()
    render(<SimplePresentationViewer slides={mockPresentationData.slides} />)

    const prevButton = screen.getByTestId('prev-button')
    const nextButton = screen.getByTestId('next-button')

    // Initially: prev disabled, next enabled
    expect(prevButton).toBeDisabled()
    expect(nextButton).not.toBeDisabled()

    // Go to middle slide
    await user.click(nextButton)
    expect(prevButton).not.toBeDisabled()
    expect(nextButton).not.toBeDisabled()

    // Go to last slide
    await user.click(nextButton)
    expect(prevButton).not.toBeDisabled()
    expect(nextButton).toBeDisabled()
  })
})