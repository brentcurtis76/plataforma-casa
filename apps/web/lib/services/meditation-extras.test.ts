import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackEmotionUsage } from './meditation-extras';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('meditation-extras service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('trackEmotionUsage', () => {
    it('should track emotion usage successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await trackEmotionUsage('peace');

      expect(mockFetch).toHaveBeenCalledWith('/api/meditation/track-emotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emotion: 'peace' })
      });
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' })
      });

      await expect(trackEmotionUsage('peace')).rejects.toThrow('Failed to track emotion usage');
    });

    it('should handle network failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(trackEmotionUsage('peace')).rejects.toThrow('Network error');
    });

    it('should validate emotion parameter', async () => {
      await expect(trackEmotionUsage('')).rejects.toThrow();
      await expect(trackEmotionUsage(null as any)).rejects.toThrow();
      await expect(trackEmotionUsage(undefined as any)).rejects.toThrow();
    });

    it('should handle special characters in emotion names', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await trackEmotionUsage('anxiety-stress');

      expect(mockFetch).toHaveBeenCalledWith('/api/meditation/track-emotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emotion: 'anxiety-stress' })
      });
    });

    it('should handle rate limiting gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Rate limit exceeded' })
      });

      await expect(trackEmotionUsage('peace')).rejects.toThrow('Failed to track emotion usage');
    });

    it('should track multiple emotions in sequence', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      await trackEmotionUsage('peace');
      await trackEmotionUsage('joy');
      await trackEmotionUsage('gratitude');

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/meditation/track-emotion', expect.objectContaining({
        body: JSON.stringify({ emotion: 'peace' })
      }));
      expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/meditation/track-emotion', expect.objectContaining({
        body: JSON.stringify({ emotion: 'joy' })
      }));
      expect(mockFetch).toHaveBeenNthCalledWith(3, '/api/meditation/track-emotion', expect.objectContaining({
        body: JSON.stringify({ emotion: 'gratitude' })
      }));
    });

    it('should not expose sensitive data in error messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized access with token xyz123' })
      });

      try {
        await trackEmotionUsage('peace');
      } catch (error) {
        expect((error as Error).message).toBe('Failed to track emotion usage');
        expect((error as Error).message).not.toContain('xyz123');
      }
    });
  });
});