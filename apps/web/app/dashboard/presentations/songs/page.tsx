'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/lib/ui';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string | null;
  lyrics: string;
  created_at: string;
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    // Filter songs based on search term
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredSongs(filtered);
  }, [searchTerm, songs]);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('church_songs')
        .select('*')
        .order('title');

      if (error) throw error;
      setSongs(data || []);
      setFilteredSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta canción?')) return;

    try {
      const { error } = await supabase
        .from('church_songs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setSongs(songs.filter(song => song.id !== id));
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Error al eliminar la canción');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando canciones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Biblioteca de Canciones</h1>
        <Link href="/dashboard/presentations/songs/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Canción
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar por título o artista..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Songs Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Artista</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSongs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  {searchTerm
                    ? 'No se encontraron canciones que coincidan con la búsqueda'
                    : 'No hay canciones en la biblioteca'}
                </TableCell>
              </TableRow>
            ) : (
              filteredSongs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell className="font-medium">{song.title}</TableCell>
                  <TableCell>{song.artist || '-'}</TableCell>
                  <TableCell>
                    {new Date(song.created_at).toLocaleDateString('es-CL')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/presentations/songs/${song.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(song.id)}
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
      </div>
    </div>
  );
}