'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/lib/ui';
import { ChevronLeft, Heart, BookOpen, Calendar, Share2, Trash2 } from 'lucide-react';
import { getFavorites, removeFavorite } from '@/lib/services/meditation-extras';
import Link from 'next/link';

interface Favorite {
  id: string;
  session_id: string;
  scripture_reference: string;
  scripture_text: string;
  scripture_version: string;
  notes?: string;
  created_at: string;
  session?: {
    emotion: string;
    meditation_text: string;
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFavorite, setSelectedFavorite] = useState<Favorite | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (sessionId: string) => {
    if (!confirm('¿Estás seguro de querer eliminar esta escritura de tus favoritos?')) {
      return;
    }

    try {
      await removeFavorite(sessionId);
      setFavorites(favorites.filter(f => f.session_id !== sessionId));
      if (selectedFavorite?.session_id === sessionId) {
        setSelectedFavorite(null);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error al eliminar favorito');
    }
  };

  const handleShare = (favorite: Favorite) => {
    const text = `${favorite.scripture_reference}\n\n"${favorite.scripture_text}"\n\n${favorite.scripture_version}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Escritura de Meditación',
        text: text,
      }).catch(console.error);
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(text).then(() => {
        alert('Escritura copiada al portapapeles');
      }).catch(console.error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/meditation">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Escrituras Favoritas</h1>
            <p className="text-gray-600">
              {favorites.length} {favorites.length === 1 ? 'escritura guardada' : 'escrituras guardadas'}
            </p>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No tienes favoritos aún</h2>
          <p className="text-gray-600 mb-6">
            Guarda las escrituras que más te inspiren durante tus meditaciones
          </p>
          <Link href="/dashboard/meditation">
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Comenzar Meditación
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Favorites List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Tus Escrituras</h2>
            {favorites.map((favorite) => (
              <Card
                key={favorite.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedFavorite?.id === favorite.id
                    ? 'ring-2 ring-blue-500'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedFavorite(favorite)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {favorite.scripture_reference}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      "{favorite.scripture_text}"
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(favorite.created_at)}
                      </span>
                      <span>{favorite.scripture_version}</span>
                    </div>
                  </div>
                  <Heart className="h-5 w-5 text-red-500 fill-current flex-shrink-0 ml-4" />
                </div>
              </Card>
            ))}
          </div>

          {/* Selected Favorite Detail */}
          {selectedFavorite && (
            <div className="lg:sticky lg:top-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-serif mb-2">
                      {selectedFavorite.scripture_reference}
                    </h2>
                    <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                      "{selectedFavorite.scripture_text}"
                    </blockquote>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedFavorite.scripture_version}
                    </p>
                  </div>

                  {selectedFavorite.session?.meditation_text && (
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Guía de Meditación</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedFavorite.session.meditation_text}
                      </p>
                    </div>
                  )}

                  {selectedFavorite.notes && (
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Tus Notas</h3>
                      <p className="text-gray-700">{selectedFavorite.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(selectedFavorite)}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Compartir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFavorite(selectedFavorite.session_id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}