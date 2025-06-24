import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('process', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://mock-supabase-url.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon-key',
    OPENAI_API_KEY: 'mock-openai-key',
  }
}));

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
  createClient: vi.fn().mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  }),
}));

// Mock OpenAI Scripture Selector
vi.mock('@/lib/ai/scripture-selector', () => ({
  EMOTIONS: {
    peace: { es: 'Paz', en: 'Peace' },
    joy: { es: 'Alegría', en: 'Joy' },
    hope: { es: 'Esperanza', en: 'Hope' },
    gratitude: { es: 'Gratitud', en: 'Gratitude' },
    anxiety: { es: 'Ansiedad', en: 'Anxiety' },
    fear: { es: 'Miedo', en: 'Fear' },
    sadness: { es: 'Tristeza', en: 'Sadness' },
  },
  generateMeditationContent: vi.fn().mockResolvedValue({
    scripture: { verse: 'Test verse', reference: 'Test 1:1' },
    meditation: { content: 'Test meditation' }
  })
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/dashboard/meditation',
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));