import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMeditationDashboard } from './useMeditationDashboard';

// Mock the fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useMeditationDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load dashboard data successfully', async () => {
    const mockData = {
      user: { id: '1', email: 'test@example.com' },
      recommendations: [
        { emotion: 'peace', reason: 'Encuentro con Dios' },
        { emotion: 'hope', reason: 'Nuevo día' },
        { emotion: 'gratitude', reason: 'Tiempo de reflexión' }
      ],
      streak: { 
        current_streak: 5, 
        longest_streak: 10,
        total_meditations: 20,
        last_meditation_date: '2025-01-01'
      },
      preferences: { 
        show_onboarding: false,
        preferred_voice: 'spanish',
        morning_emotion: null,
        evening_emotion: null
      },
      lastEmotion: 'peace',
      greeting: {
        greeting: 'Buenos días',
        icon: '☀️',
        message: 'Comienza tu día con oración'
      },
      recentSessions: [],
      stats: { 
        totalSessions: 15, 
        totalMinutes: 120,
        favoriteEmotion: 'peace',
        averageRating: 4.2,
        favoritesCount: 3,
        emotionBreakdown: { peace: 5, joy: 3 }
      }
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const { result } = renderHook(() => useMeditationDashboard());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(mockFetch).toHaveBeenCalledWith('/api/meditation/dashboard');
  });

  it('should handle API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' })
    });

    const { result } = renderHook(() => useMeditationDashboard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  it('should handle network failures', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useMeditationDashboard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  it('should provide default values when data is partial', async () => {
    const partialData = {
      user: { id: '1', email: 'test@example.com' },
      recommendations: [],
      streak: null,
      preferences: null,
      lastEmotion: null,
      greeting: null,
      recentSessions: [],
      stats: null
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => partialData
    });

    const { result } = renderHook(() => useMeditationDashboard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data?.recommendations).toEqual([]);
    expect(result.current.data?.streak).toBeNull();
    expect(result.current.data?.preferences).toBeNull();
  });

  it('should only fetch once on mount', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: {} })
    });

    const { rerender } = renderHook(() => useMeditationDashboard());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Re-render should not trigger another fetch
    rerender();
    
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});