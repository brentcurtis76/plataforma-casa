-- Add user feedback collection system for iterative improvement

-- User feedback table
CREATE TABLE church_user_feedback (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES church_profiles(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('spiritual_impact', 'feature_request', 'technical_issue', 'general')),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  suggestions text,
  feature_priority text[], -- Array of requested features
  spiritual_growth_notes text,
  trigger_event text, -- 'session_complete', 'weekly', 'manual'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pastoral notifications (for positive spiritual growth)
CREATE TABLE church_pastoral_notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES church_profiles(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  message text NOT NULL,
  priority text DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
  is_read boolean DEFAULT false,
  assigned_to uuid REFERENCES church_profiles(id), -- Pastor assigned to follow up
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Admin notifications (for technical issues and low satisfaction)
CREATE TABLE church_admin_notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_type text NOT NULL,
  message text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  user_id uuid REFERENCES church_profiles(id), -- User who reported the issue
  is_resolved boolean DEFAULT false,
  assigned_to uuid REFERENCES church_profiles(id), -- Admin assigned to resolve
  metadata jsonb, -- Additional context (rating, type, etc.)
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Indexes for performance
CREATE INDEX idx_feedback_user_id ON church_user_feedback(user_id);
CREATE INDEX idx_feedback_type_rating ON church_user_feedback(feedback_type, rating);
CREATE INDEX idx_feedback_created_at ON church_user_feedback(created_at DESC);

CREATE INDEX idx_pastoral_notifications_user ON church_pastoral_notifications(user_id);
CREATE INDEX idx_pastoral_notifications_assigned ON church_pastoral_notifications(assigned_to);
CREATE INDEX idx_pastoral_notifications_unread ON church_pastoral_notifications(is_read) WHERE is_read = false;

CREATE INDEX idx_admin_notifications_priority ON church_admin_notifications(priority);
CREATE INDEX idx_admin_notifications_unresolved ON church_admin_notifications(is_resolved) WHERE is_resolved = false;

-- RLS Policies

-- Users can only insert their own feedback
ALTER TABLE church_user_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own feedback" ON church_user_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all feedback, users can view their own
CREATE POLICY "Admin can view all feedback" ON church_user_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM church_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view own feedback" ON church_user_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Pastoral notifications
ALTER TABLE church_pastoral_notifications ENABLE ROW LEVEL SECURITY;

-- Pastors and admins can view pastoral notifications
CREATE POLICY "Pastors and admins view notifications" ON church_pastoral_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM church_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'pastor', 'leader')
    )
  );

-- System can insert pastoral notifications
CREATE POLICY "System can insert pastoral notifications" ON church_pastoral_notifications
  FOR INSERT WITH CHECK (true);

-- Pastors can update their assigned notifications
CREATE POLICY "Pastors update assigned notifications" ON church_pastoral_notifications
  FOR UPDATE USING (
    assigned_to = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM church_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin notifications
ALTER TABLE church_admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin notifications
CREATE POLICY "Admins view admin notifications" ON church_admin_notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM church_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- System can insert admin notifications
CREATE POLICY "System can insert admin notifications" ON church_admin_notifications
  FOR INSERT WITH CHECK (true);

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON church_user_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to get feedback statistics (for admin dashboard)
CREATE OR REPLACE FUNCTION get_feedback_statistics(
  start_date timestamptz DEFAULT now() - interval '30 days',
  end_date timestamptz DEFAULT now()
)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_responses', COUNT(*),
    'average_rating', ROUND(AVG(rating), 2),
    'response_rate_daily', COUNT(*) / EXTRACT(days FROM end_date - start_date),
    'type_breakdown', (
      SELECT jsonb_object_agg(feedback_type, count)
      FROM (
        SELECT feedback_type, COUNT(*) as count
        FROM church_user_feedback
        WHERE created_at BETWEEN start_date AND end_date
        GROUP BY feedback_type
      ) t
    ),
    'rating_distribution', (
      SELECT jsonb_object_agg(rating::text, count)
      FROM (
        SELECT rating, COUNT(*) as count
        FROM church_user_feedback
        WHERE created_at BETWEEN start_date AND end_date
        GROUP BY rating
        ORDER BY rating
      ) r
    ),
    'top_feature_requests', (
      SELECT jsonb_agg(jsonb_build_object('feature', feature, 'requests', count))
      FROM (
        SELECT feature, COUNT(*) as count
        FROM church_user_feedback,
        LATERAL unnest(feature_priority) as feature
        WHERE created_at BETWEEN start_date AND end_date
        AND feature_priority IS NOT NULL
        GROUP BY feature
        ORDER BY count DESC
        LIMIT 10
      ) f
    ),
    'satisfaction_trend', (
      SELECT jsonb_agg(jsonb_build_object('date', date, 'avg_rating', avg_rating))
      FROM (
        SELECT date_trunc('day', created_at)::date as date,
               ROUND(AVG(rating), 2) as avg_rating
        FROM church_user_feedback
        WHERE created_at BETWEEN start_date AND end_date
        GROUP BY date_trunc('day', created_at)
        ORDER BY date
      ) trend
    )
  ) INTO result
  FROM church_user_feedback
  WHERE created_at BETWEEN start_date AND end_date;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;