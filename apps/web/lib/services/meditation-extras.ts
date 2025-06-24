import { createClient } from '@/lib/supabase/client';

// Favorites management
export async function addFavorite(sessionId: string) {
  const supabase = createClient();
  
  const { data: session } = await supabase
    .from('church_meditation_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (!session) throw new Error('Session not found');

  const { data, error } = await supabase
    .from('church_meditation_favorites')
    .insert({
      session_id: sessionId,
      scripture_reference: session.scripture_reference,
      scripture_text: session.scripture_text,
      scripture_version: session.scripture_version
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavorite(sessionId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('church_meditation_favorites')
    .delete()
    .eq('session_id', sessionId);

  if (error) throw error;
}

export async function getFavorites() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('church_meditation_favorites')
    .select(`
      *,
      session:church_meditation_sessions(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function isFavorite(sessionId: string) {
  const supabase = createClient();
  
  const { data } = await supabase
    .from('church_meditation_favorites')
    .select('id')
    .eq('session_id', sessionId)
    .single();

  return !!data;
}

// Streak management
export async function getStreak() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('church_meditation_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  
  return data || {
    current_streak: 0,
    longest_streak: 0,
    total_meditations: 0,
    last_meditation_date: null
  };
}

// Preferences management
export async function getPreferences() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  let { data, error } = await supabase
    .from('church_meditation_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Create default preferences if none exist
  if (!data) {
    const { data: newPrefs, error: createError } = await supabase
      .from('church_meditation_preferences')
      .insert({ user_id: user.id })
      .select()
      .single();
    
    if (createError) throw createError;
    data = newPrefs;
  }

  return data;
}

export async function updatePreferences(updates: any) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('church_meditation_preferences')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Emotion recommendations
export async function getEmotionRecommendations() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  // Get recommendations from the database function
  const { data, error } = await supabase
    .rpc('get_emotion_recommendations', { p_user_id: user.id });

  if (error) throw error;

  // Get time-based defaults if no personalized recommendations
  if (!data || data.length === 0) {
    const hour = new Date().getHours();
    
    if (hour < 6) {
      return [
        { emotion: 'peace', reason: 'Para un descanso tranquilo' },
        { emotion: 'gratitude', reason: 'Reflexión nocturna' }
      ];
    } else if (hour < 12) {
      return [
        { emotion: 'joy', reason: 'Comenzar el día con alegría' },
        { emotion: 'hope', reason: 'Nuevas oportunidades' },
        { emotion: 'peace', reason: 'Paz para el día' }
      ];
    } else if (hour < 18) {
      return [
        { emotion: 'peace', reason: 'Tranquilidad en la tarde' },
        { emotion: 'seeking', reason: 'Guía para decisiones' }
      ];
    } else {
      return [
        { emotion: 'gratitude', reason: 'Agradecer el día' },
        { emotion: 'peace', reason: 'Descanso nocturno' },
        { emotion: 'love', reason: 'Reflexión familiar' }
      ];
    }
  }

  return data.map((rec: any) => ({
    emotion: rec.emotion,
    score: rec.score
  }));
}

export async function trackEmotionUsage(emotion: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const hour = new Date().getHours();
  const timeOfDay = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const dayOfWeek = new Date().getDay();

  // Upsert recommendation data
  const { error } = await supabase
    .from('church_meditation_recommendations')
    .upsert({
      user_id: user.id,
      emotion,
      time_of_day: timeOfDay,
      day_of_week: dayOfWeek,
      frequency: 1,
      last_used: new Date().toISOString()
    }, {
      onConflict: 'user_id,emotion,time_of_day,day_of_week',
      ignoreDuplicates: false
    });

  if (error) throw error;
}

// Recent sessions
export async function getRecentSessions(limit = 5) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('church_meditation_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Session statistics
export async function getSessionStats() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  // Get total sessions count
  const { count: totalSessions } = await supabase
    .from('church_meditation_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get favorite emotions
  const { data: emotionData } = await supabase
    .from('church_meditation_sessions')
    .select('emotion')
    .eq('user_id', user.id);

  const emotionCounts: Record<string, number> = {};
  emotionData?.forEach(session => {
    emotionCounts[session.emotion] = (emotionCounts[session.emotion] || 0) + 1;
  });

  const favoriteEmotion = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

  // Get average session time (if we track duration)
  const { data: sessions } = await supabase
    .from('church_meditation_sessions')
    .select('duration')
    .eq('user_id', user.id)
    .not('duration', 'is', null);

  const avgDuration = sessions?.length 
    ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length
    : 0;

  return {
    totalSessions: totalSessions || 0,
    favoriteEmotion,
    avgDuration,
    emotionBreakdown: emotionCounts
  };
}