'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/lib/ui';
import { EMOTIONS } from '@/lib/ai/scripture-selector';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  Heart,
  Play,
  Trash2,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { StreakDisplay, MeditationCalendar } from '@/components/meditation/StreakDisplay';

interface MeditationSession {
  id: string;
  emotion: string;
  scripture_reference: string;
  scripture_text: string;
  audio_url: string | null;
  duration: number | null;
  user_feedback: number | null;
  created_at: string;
}

export default function MeditationHistoryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    favoriteEmotion: '',
    averageRating: 0
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch meditation sessions
      const { data: sessionsData, error } = await supabase
        .from('church_meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSessions(sessionsData || []);

      // Calculate statistics
      if (sessionsData && sessionsData.length > 0) {
        const totalMinutes = sessionsData.reduce((sum, session) => 
          sum + (session.duration || 0), 0
        ) / 60;

        const emotionCounts = sessionsData.reduce((acc, session) => {
          acc[session.emotion] = (acc[session.emotion] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const favoriteEmotion = Object.entries(emotionCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || '';

        const ratingsCount = sessionsData.filter(s => s.user_feedback).length;
        const averageRating = ratingsCount > 0
          ? sessionsData.reduce((sum, s) => sum + (s.user_feedback || 0), 0) / ratingsCount
          : 0;

        setStats({
          totalSessions: sessionsData.length,
          totalMinutes: Math.round(totalMinutes),
          favoriteEmotion,
          averageRating: Math.round(averageRating * 10) / 10
        });
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta sesión?')) return;

    try {
      const { error } = await supabase
        .from('church_meditation_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSessions(sessions.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Error al eliminar la sesión');
    }
  };

  const replaySession = (session: MeditationSession) => {
    const params = new URLSearchParams({
      emotion: session.emotion,
      replay: session.id
    });
    router.push(`/dashboard/meditation/session?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando historial...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/meditation">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Historial de Meditaciones</h1>
        </div>
      </div>

      {/* Streak Display */}
      <StreakDisplay />

      {/* Meditation Calendar */}
      <MeditationCalendar />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sesiones</p>
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
            </div>
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Minutos Totales</p>
              <p className="text-2xl font-bold">{stats.totalMinutes}</p>
            </div>
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Emoción Frecuente</p>
              <p className="text-lg font-bold">
                {stats.favoriteEmotion && EMOTIONS[stats.favoriteEmotion as keyof typeof EMOTIONS]?.es}
              </p>
            </div>
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Calificación Promedio</p>
              <p className="text-2xl font-bold">{stats.averageRating}/5</p>
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Heart
                  key={star}
                  className={`h-4 w-4 ${
                    star <= stats.averageRating ? 'text-red-500 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Emoción</TableHead>
              <TableHead>Escritura</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No hay sesiones de meditación registradas
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(session.created_at).toLocaleDateString('es-CL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {EMOTIONS[session.emotion as keyof typeof EMOTIONS]?.es || session.emotion}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {session.scripture_reference}
                  </TableCell>
                  <TableCell>
                    {session.duration ? `${Math.round(session.duration / 60)} min` : '-'}
                  </TableCell>
                  <TableCell>
                    {session.user_feedback ? (
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Heart
                            key={star}
                            className={`h-4 w-4 ${
                              star <= session.user_feedback! ? 'text-red-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => replaySession(session)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSession(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}