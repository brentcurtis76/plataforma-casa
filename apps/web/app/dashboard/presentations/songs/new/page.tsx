'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Label, Textarea } from '@/lib/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewSongPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    lyrics: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get user's organization
      const { data: profile, error: profileError } = await supabase
        .from('church_profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Create song
      const { error } = await supabase
        .from('church_songs')
        .insert({
          organization_id: profile.organization_id,
          title: formData.title,
          artist: formData.artist || null,
          lyrics: formData.lyrics,
          created_by: user.id,
        });

      if (error) throw error;

      router.push('/dashboard/presentations/songs');
    } catch (error) {
      console.error('Error creating song:', error);
      alert('Error al crear la canción');
    } finally {
      setLoading(false);
    }
  };

  const formatLyrics = (text: string) => {
    // Auto-format lyrics with proper spacing
    return text
      .split('\n\n')
      .map(section => section.trim())
      .filter(section => section.length > 0)
      .join('\n\n');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/presentations/songs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Canciones
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-6">Nueva Canción</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Ej: Grande es Tu Fidelidad"
            />
          </div>

          <div>
            <Label htmlFor="artist">Artista/Autor</Label>
            <Input
              id="artist"
              type="text"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              placeholder="Ej: Marcos Witt"
            />
          </div>

          <div>
            <Label htmlFor="lyrics">Letra *</Label>
            <Textarea
              id="lyrics"
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
              required
              rows={15}
              placeholder="Escribe la letra de la canción aquí...

Separa las estrofas con líneas en blanco.

Ejemplo:
Tu fidelidad es grande
Tu fidelidad incomparable es
Nadie como Tú, bendito Dios
Grande es Tu fidelidad

Grande es Tu fidelidad
Grande es Tu fidelidad
Cada mañana se renuevan Tus bondades
Grande es Tu fidelidad"
              className="font-mono"
            />
            <p className="text-sm text-gray-500 mt-1">
              Consejo: Separa las estrofas con líneas en blanco para mejor visualización
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard/presentations/songs">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.lyrics}
            >
              {loading ? 'Guardando...' : 'Guardar Canción'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}