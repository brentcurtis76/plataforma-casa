'use client';

import { useState, useEffect } from 'react';
import { Card } from '@church-admin/ui';
import { Flame, TrendingUp, Calendar, Award } from 'lucide-react';
import { getStreak, getSessionStats } from '@/lib/services/meditation-extras';

interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_meditations: number;
  last_meditation_date: string | null;
}

interface SessionStats {
  totalSessions: number;
  favoriteEmotion: string | null;
  avgDuration: number;
  emotionBreakdown: Record<string, number>;
}

export function StreakDisplay() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [streakData, statsData] = await Promise.all([
        getStreak(),
        getSessionStats()
      ]);
      setStreak(streakData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilNext = (current: number): number => {
    const milestones = [7, 14, 30, 60, 100, 365];
    const next = milestones.find(m => m > current);
    return next ? next - current : 0;
  };

  const getStreakMessage = (days: number): string => {
    if (days === 0) return 'Comienza tu caminar diario con Dios';
    if (days === 1) return 'Un hermoso primer paso';
    if (days < 7) return 'Cultivando el hábito de la oración';
    if (days < 14) return 'Una semana en comunión';
    if (days < 30) return 'Creciendo en disciplina espiritual';
    if (days < 60) return 'Un mes de búsqueda constante';
    if (days < 100) return 'Profundizando en Su presencia';
    if (days < 365) return 'Un caminar fiel y constante';
    return 'Un año caminando con Él';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!streak || !stats) return null;

  const daysUntilNext = getDaysUntilNext(streak.current_streak);
  const streakPercentage = streak.current_streak > 0 && daysUntilNext > 0
    ? ((streak.current_streak % 7) / 7) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Spiritual Journey Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {streak.current_streak === 0 ? 'Tu jornada espiritual' : 
                   streak.current_streak === 1 ? '1 día en comunión' : 
                   `${streak.current_streak} días en comunión`}
                </h3>
                <p className="text-sm text-gray-600">{getStreakMessage(streak.current_streak)}</p>
              </div>
            </div>
            
            {streak.current_streak > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  "La constancia en la oración fortalece el espíritu"
                </p>
                {daysUntilNext > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${streakPercentage}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subtle Milestones */}
          <div className="hidden md:block text-right">
            {streak.longest_streak > 0 && (
              <div className="text-sm text-gray-500">
                <p>Mejor temporada:</p>
                <p className="font-medium">{streak.longest_streak} días</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Meditations */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Meditaciones</p>
              <p className="text-3xl font-bold">{stats.totalSessions}</p>
              {streak.last_meditation_date && (
                <p className="text-xs text-gray-500 mt-1">
                  Última: {new Date(streak.last_meditation_date).toLocaleDateString('es-ES')}
                </p>
              )}
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        {/* Longest Streak */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Racha Más Larga</p>
              <p className="text-3xl font-bold">{streak.longest_streak} días</p>
              <p className="text-xs text-gray-500 mt-1">Tu mejor récord</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        {/* Favorite Emotion */}
        {stats.favoriteEmotion && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emoción Favorita</p>
                <p className="text-lg font-bold capitalize">{stats.favoriteEmotion}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.emotionBreakdown[stats.favoriteEmotion]} veces
                </p>
              </div>
              <div className="text-3xl">💭</div>
            </div>
          </Card>
        )}
      </div>

      {/* Spiritual Encouragement */}
      <Card className="p-6 bg-blue-50 text-center">
        <p className="text-lg font-medium text-blue-900 mb-2">
          {streak.current_streak === 0 
            ? '"Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar"'
            : '"Perseverad en la oración, velando en ella con acción de gracias"'
          }
        </p>
        <p className="text-sm text-blue-700">
          {streak.current_streak === 0 ? 'Mateo 11:28' : 'Colosenses 4:2'}
        </p>
      </Card>
    </div>
  );
}

// Calendar heat map for meditation history
export function MeditationCalendar() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { getRecentSessions } = await import('@/lib/services/meditation-extras');
      const data = await getRecentSessions(365); // Get last year
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.created_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getWeeks = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364); // ~52 weeks

    let currentWeek = [];
    let currentDate = new Date(startDate);

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayOfWeek = currentDate.getDay();
      
      currentWeek[dayOfWeek] = {
        date: dateStr,
        count: sessionsByDate[dateStr] || 0,
        isToday: dateStr === today.toISOString().split('T')[0]
      };

      if (dayOfWeek === 6) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-green-200';
    if (count === 2) return 'bg-green-400';
    return 'bg-green-600';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-53 gap-1">
            {Array.from({ length: 365 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded-sm"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const weeks = getWeeks();
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Tu año de meditación</h3>
      
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Day labels */}
          <div className="flex mb-1">
            <div className="w-8"></div>
            {days.map((day, i) => (
              <div key={i} className="w-4 text-xs text-gray-500 text-center">
                {i % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            {/* Month labels */}
            <div className="flex flex-col justify-between mr-1">
              {months.map((month, i) => (
                <div key={i} className="text-xs text-gray-500 h-4">
                  {i % 3 === 0 ? month : ''}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = week[dayIndex];
                    if (!day) {
                      return <div key={dayIndex} className="w-3 h-3" />;
                    }
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} ${
                          day.isToday ? 'ring-2 ring-blue-500' : ''
                        }`}
                        title={`${day.date}: ${day.count} meditaciones`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
            <span>Menos</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
            </div>
            <span>Más</span>
          </div>
        </div>
      </div>
    </Card>
  );
}