import { useState, useEffect } from 'react';

interface MeditationDashboard {
  user: {
    id: string;
    email: string;
  };
  streak: {
    current_streak: number;
    longest_streak: number;
    total_meditations: number;
    last_meditation_date: string | null;
  };
  preferences: {
    show_onboarding: boolean;
    preferred_voice: string;
    morning_emotion: string | null;
    evening_emotion: string | null;
  };
  recentSessions: any[];
  lastEmotion: string | null;
  recommendations: Array<{
    emotion: string;
    reason: string;
  }>;
  stats: {
    totalSessions: number;
    totalMinutes: number;
    favoriteEmotion: string | null;
    averageRating: number;
    favoritesCount: number;
    emotionBreakdown: Record<string, number>;
  };
  greeting: {
    greeting: string;
    icon: string;
    message: string;
  };
}

export function useMeditationDashboard() {
  const [data, setData] = useState<MeditationDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/meditation/dashboard');
      
      if (!response.ok) {
        throw new Error(`Dashboard API error: ${response.status}`);
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const refresh = () => {
    fetchDashboard();
  };

  return {
    data,
    loading,
    error,
    refresh
  };
}

// Helper hook for individual components that need specific data
export function useMeditationStreak() {
  const { data, loading, error } = useMeditationDashboard();
  
  return {
    streak: data?.streak || {
      current_streak: 0,
      longest_streak: 0,
      total_meditations: 0,
      last_meditation_date: null
    },
    loading,
    error
  };
}

export function useMeditationRecommendations() {
  const { data, loading, error } = useMeditationDashboard();
  
  return {
    recommendations: data?.recommendations || [],
    lastEmotion: data?.lastEmotion,
    loading,
    error
  };
}

export function useMeditationStats() {
  const { data, loading, error } = useMeditationDashboard();
  
  return {
    stats: data?.stats || {
      totalSessions: 0,
      totalMinutes: 0,
      favoriteEmotion: null,
      averageRating: 0,
      favoritesCount: 0,
      emotionBreakdown: {}
    },
    loading,
    error
  };
}