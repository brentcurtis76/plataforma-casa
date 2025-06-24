import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const feedback = await request.json();
    
    // Validate required fields
    if (!feedback.type || !feedback.rating || !feedback.message) {
      return NextResponse.json({ 
        error: 'Missing required fields: type, rating, message' 
      }, { status: 400 });
    }

    // Save feedback to database
    const { error: insertError } = await supabase
      .from('church_user_feedback')
      .insert({
        user_id: user.id,
        feedback_type: feedback.type,
        rating: feedback.rating,
        message: feedback.message,
        suggestions: feedback.suggestions,
        feature_priority: feedback.feature_priority,
        trigger_event: feedback.trigger,
        spiritual_growth_notes: feedback.spiritual_growth,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json({ 
        error: 'Failed to save feedback' 
      }, { status: 500 });
    }

    // If this is spiritual impact feedback with high rating, 
    // potentially flag for pastoral follow-up
    if (feedback.type === 'spiritual_impact' && feedback.rating >= 4) {
      await supabase
        .from('church_pastoral_notifications')
        .insert({
          user_id: user.id,
          notification_type: 'positive_spiritual_growth',
          message: `User reported positive spiritual impact: "${feedback.message.substring(0, 100)}..."`,
          priority: 'low',
          created_at: new Date().toISOString()
        });
    }

    // If technical issue or low rating, flag for immediate attention
    if (feedback.type === 'technical_issue' || feedback.rating <= 2) {
      await supabase
        .from('church_admin_notifications')
        .insert({
          notification_type: feedback.type === 'technical_issue' ? 'technical_issue' : 'low_satisfaction',
          message: `User feedback requires attention: ${feedback.message.substring(0, 100)}...`,
          priority: feedback.rating <= 2 ? 'high' : 'medium',
          user_id: user.id,
          metadata: {
            rating: feedback.rating,
            type: feedback.type,
            trigger: feedback.trigger
          },
          created_at: new Date().toISOString()
        });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Feedback received successfully' 
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Only allow admins to view feedback
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('church_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get feedback with user info
    const { data: feedback, error } = await supabase
      .from('church_user_feedback')
      .select(`
        *,
        church_profiles!inner(email, full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch feedback' 
      }, { status: 500 });
    }

    // Aggregate statistics
    const stats = {
      total_responses: feedback.length,
      average_rating: feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length,
      type_breakdown: feedback.reduce((acc, f) => {
        acc[f.feedback_type] = (acc[f.feedback_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      feature_requests: feedback
        .filter(f => f.feature_priority?.length > 0)
        .flatMap(f => f.feature_priority)
        .reduce((acc, feature) => {
          acc[feature] = (acc[feature] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
    };

    return NextResponse.json({ 
      feedback,
      statistics: stats
    });

  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}