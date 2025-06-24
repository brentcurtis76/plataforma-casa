-- Add favorites table for meditation scriptures
CREATE TABLE IF NOT EXISTS church_meditation_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES church_meditation_sessions(id) ON DELETE CASCADE,
  scripture_reference TEXT NOT NULL,
  scripture_text TEXT NOT NULL,
  scripture_version TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- Add meditation streaks table
CREATE TABLE IF NOT EXISTS church_meditation_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_meditation_date DATE,
  total_meditations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user preferences table for meditation
CREATE TABLE IF NOT EXISTS church_meditation_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferred_voice TEXT DEFAULT 'maria',
  preferred_duration TEXT DEFAULT 'medium',
  morning_emotion TEXT,
  evening_emotion TEXT,
  show_onboarding BOOLEAN DEFAULT true,
  enable_notifications BOOLEAN DEFAULT true,
  notification_time TIME DEFAULT '08:00:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add emotion recommendations table
CREATE TABLE IF NOT EXISTS church_meditation_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emotion TEXT NOT NULL,
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  frequency INTEGER DEFAULT 1,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, emotion, time_of_day, day_of_week)
);

-- Create indexes for performance
CREATE INDEX idx_meditation_favorites_user ON church_meditation_favorites(user_id);
CREATE INDEX idx_meditation_streaks_user ON church_meditation_streaks(user_id);
CREATE INDEX idx_meditation_preferences_user ON church_meditation_preferences(user_id);
CREATE INDEX idx_meditation_recommendations_user ON church_meditation_recommendations(user_id);
CREATE INDEX idx_meditation_recommendations_time ON church_meditation_recommendations(time_of_day);

-- Enable RLS
ALTER TABLE church_meditation_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_meditation_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_meditation_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_meditation_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON church_meditation_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites" ON church_meditation_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON church_meditation_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for streaks
CREATE POLICY "Users can view own streaks" ON church_meditation_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own streaks" ON church_meditation_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON church_meditation_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for preferences
CREATE POLICY "Users can view own preferences" ON church_meditation_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own preferences" ON church_meditation_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON church_meditation_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for recommendations
CREATE POLICY "Users can view own recommendations" ON church_meditation_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own recommendations" ON church_meditation_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations" ON church_meditation_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update meditation streak
CREATE OR REPLACE FUNCTION update_meditation_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  -- Get current streak data
  SELECT last_meditation_date, current_streak, longest_streak
  INTO v_last_date, v_current_streak, v_longest_streak
  FROM church_meditation_streaks
  WHERE user_id = p_user_id;

  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO church_meditation_streaks (user_id, current_streak, longest_streak, last_meditation_date, total_meditations)
    VALUES (p_user_id, 1, 1, CURRENT_DATE, 1);
    RETURN;
  END IF;

  -- Update streak based on last meditation date
  IF v_last_date = CURRENT_DATE THEN
    -- Already meditated today, just increment total
    UPDATE church_meditation_streaks
    SET total_meditations = total_meditations + 1,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSIF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    v_current_streak := v_current_streak + 1;
    v_longest_streak := GREATEST(v_longest_streak, v_current_streak);
    
    UPDATE church_meditation_streaks
    SET current_streak = v_current_streak,
        longest_streak = v_longest_streak,
        last_meditation_date = CURRENT_DATE,
        total_meditations = total_meditations + 1,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    -- Streak broken, reset to 1
    UPDATE church_meditation_streaks
    SET current_streak = 1,
        last_meditation_date = CURRENT_DATE,
        total_meditations = total_meditations + 1,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update streak when new meditation session is created
CREATE OR REPLACE FUNCTION trigger_update_meditation_streak()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_meditation_streak(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_streak_on_meditation
AFTER INSERT ON church_meditation_sessions
FOR EACH ROW
EXECUTE FUNCTION trigger_update_meditation_streak();

-- Function to get emotion recommendations
CREATE OR REPLACE FUNCTION get_emotion_recommendations(p_user_id UUID)
RETURNS TABLE(emotion TEXT, score NUMERIC) AS $$
BEGIN
  RETURN QUERY
  WITH time_period AS (
    SELECT 
      CASE 
        WHEN EXTRACT(HOUR FROM NOW()) < 6 THEN 'night'
        WHEN EXTRACT(HOUR FROM NOW()) < 12 THEN 'morning'
        WHEN EXTRACT(HOUR FROM NOW()) < 18 THEN 'afternoon'
        ELSE 'evening'
      END AS current_period,
      EXTRACT(DOW FROM NOW())::INTEGER AS current_dow
  ),
  user_patterns AS (
    SELECT 
      r.emotion,
      SUM(r.frequency) AS total_frequency,
      MAX(CASE WHEN r.time_of_day = tp.current_period THEN r.frequency ELSE 0 END) AS time_match,
      MAX(CASE WHEN r.day_of_week = tp.current_dow THEN r.frequency ELSE 0 END) AS day_match,
      MAX(r.last_used) AS last_used
    FROM church_meditation_recommendations r
    CROSS JOIN time_period tp
    WHERE r.user_id = p_user_id
    GROUP BY r.emotion
  )
  SELECT 
    emotion,
    (
      COALESCE(total_frequency, 0) * 0.3 +
      COALESCE(time_match, 0) * 0.4 +
      COALESCE(day_match, 0) * 0.2 +
      CASE 
        WHEN last_used IS NULL THEN 0.1
        WHEN last_used < NOW() - INTERVAL '7 days' THEN 0.1
        ELSE 0
      END
    )::NUMERIC AS score
  FROM user_patterns
  ORDER BY score DESC
  LIMIT 3;
END;
$$ LANGUAGE plpgsql;