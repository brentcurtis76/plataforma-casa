-- Add additional metadata columns to church_meditation_sessions
ALTER TABLE church_meditation_sessions 
ADD COLUMN IF NOT EXISTS voice_id TEXT,
ADD COLUMN IF NOT EXISTS background_music TEXT,
ADD COLUMN IF NOT EXISTS scripture_version TEXT DEFAULT 'RVR1960',
ADD COLUMN IF NOT EXISTS ai_prompt TEXT,
ADD COLUMN IF NOT EXISTS user_feedback INTEGER CHECK (user_feedback >= 1 AND user_feedback <= 5);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_id ON church_meditation_sessions(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_created_at ON church_meditation_sessions(created_at DESC);

-- Add RLS policies
ALTER TABLE church_meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own meditation sessions
CREATE POLICY "Users can view own meditation sessions" ON church_meditation_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own meditation sessions
CREATE POLICY "Users can create own meditation sessions" ON church_meditation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own meditation sessions (for feedback)
CREATE POLICY "Users can update own meditation sessions" ON church_meditation_sessions
  FOR UPDATE USING (auth.uid() = user_id);