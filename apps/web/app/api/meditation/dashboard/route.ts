import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Execute all queries in parallel for better performance
    const [
      recentSessionsResult,
      streakResult,
      preferencesResult,
      favoritesCountResult,
      statsResult
    ] = await Promise.allSettled([
      // Recent sessions (last 5)
      supabase
        .from('church_meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),

      // Streak data
      supabase
        .from('church_meditation_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single(),

      // User preferences
      supabase
        .from('church_meditation_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single(),

      // Favorites count
      supabase
        .from('church_meditation_favorites')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),

      // Session statistics
      supabase
        .from('church_meditation_sessions')
        .select('emotion, user_feedback, duration')
        .eq('user_id', user.id)
    ]);

    // Process results
    const recentSessions = recentSessionsResult.status === 'fulfilled' 
      ? recentSessionsResult.value.data || []
      : [];

    const streak = streakResult.status === 'fulfilled' && streakResult.value.data
      ? streakResult.value.data
      : {
          current_streak: 0,
          longest_streak: 0,
          total_meditations: 0,
          last_meditation_date: null
        };

    const preferences = preferencesResult.status === 'fulfilled' && preferencesResult.value.data
      ? preferencesResult.value.data
      : {
          show_onboarding: true,
          preferred_voice: 'maria',
          morning_emotion: null,
          evening_emotion: null
        };

    const favoritesCount = favoritesCountResult.status === 'fulfilled'
      ? favoritesCountResult.value.count || 0
      : 0;

    // Calculate session statistics
    const allSessions = statsResult.status === 'fulfilled' 
      ? statsResult.value.data || []
      : [];

    const totalSessions = allSessions.length;
    const totalMinutes = Math.round(
      allSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60
    );

    // Calculate favorite emotion
    const emotionCounts = allSessions.reduce((acc, session) => {
      acc[session.emotion] = (acc[session.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    // Calculate average rating
    const ratingsCount = allSessions.filter(s => s.user_feedback).length;
    const averageRating = ratingsCount > 0
      ? allSessions.reduce((sum, s) => sum + (s.user_feedback || 0), 0) / ratingsCount
      : 0;

    // Generate time-based recommendations
    const hour = new Date().getHours();
    let recommendations = [];

    if (hour < 12) {
      recommendations = [
        { emotion: 'peace', reason: 'Encuentro con Dios' },
        { emotion: 'hope', reason: 'Nuevo día con propósito' },
        { emotion: 'seeking', reason: 'Buscar dirección divina' }
      ];
    } else if (hour < 18) {
      recommendations = [
        { emotion: 'peace', reason: 'Encuentro con Dios' },
        { emotion: 'seeking', reason: 'Sabiduría para decisiones' },
        { emotion: 'gratitude', reason: 'Reconocer bendiciones' }
      ];
    } else {
      recommendations = [
        { emotion: 'peace', reason: 'Encuentro con Dios' },
        { emotion: 'gratitude', reason: 'Reflexión del día' },
        { emotion: 'love', reason: 'Conexión familiar' }
      ];
    }

    // Get last emotion for quick meditation
    const lastEmotion = recentSessions.length > 0 ? recentSessions[0].emotion : null;

    // Compile dashboard data
    const dashboardData = {
      user: {
        id: user.id,
        email: user.email
      },
      streak,
      preferences,
      recentSessions,
      lastEmotion,
      recommendations,
      stats: {
        totalSessions,
        totalMinutes,
        favoriteEmotion,
        averageRating: Math.round(averageRating * 10) / 10,
        favoritesCount,
        emotionBreakdown: emotionCounts
      },
      greeting: getTimeGreeting()
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  
  if (hour < 6) {
    return {
      greeting: 'Que la paz de Dios te acompañe',
      icon: '🌙',
      message: 'Un momento de tranquilidad antes del descanso'
    };
  } else if (hour < 12) {
    return {
      greeting: 'Buenos días',
      icon: '☀️',
      message: 'Comienza tu día con la Palabra de Dios'
    };
  } else if (hour < 18) {
    return {
      greeting: 'Buenas tardes',
      icon: '🌤️',
      message: 'Un momento de reflexión en tu día'
    };
  } else {
    return {
      greeting: 'Buenas noches',
      icon: '🌙',
      message: 'Encuentra paz al final del día'
    };
  }
}