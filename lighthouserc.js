module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3001/dashboard/meditation'],
      startServerCommand: 'cd apps/web && npm run dev',
      startServerReadyPattern: 'Ready on',
      startServerTimeout: 60000,
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // Performance thresholds
        'categories:performance': ['error', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // Meditation-specific metrics
        'unused-javascript': ['warn', { maxNumericValue: 200000 }],
        'render-blocking-resources': ['warn', { maxNumericValue: 500 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Accessibility for spiritual content
        'color-contrast': 'error',
        'heading-order': 'error',
        'aria-allowed-attr': 'error',
        'button-name': 'error',
        'link-name': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
      storage: './lighthouse-results',
    },
  },
};