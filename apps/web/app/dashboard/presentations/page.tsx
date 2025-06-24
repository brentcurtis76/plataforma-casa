'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/lib/ui';
import { PlusCircle, Music, Presentation, FileText } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string | null;
  created_at: string;
}

interface Service {
  id: string;
  title: string;
  date: string;
  created_at: string;
}

interface Template {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
}

export default function PresentationsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch songs
      const { data: songsData, error: songsError } = await supabase
        .from('church_songs')
        .select('id, title, artist, created_at')
        .order('title');

      if (songsError) throw songsError;

      // Fetch recent services
      const { data: servicesData, error: servicesError } = await supabase
        .from('church_services')
        .select('id, title, date, created_at')
        .order('date', { ascending: false })
        .limit(5);

      if (servicesError) throw servicesError;

      // Fetch templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('church_presentation_templates')
        .select('id, name, is_default, created_at')
        .order('name');

      if (templatesError) throw templatesError;

      setSongs(songsData || []);
      setServices(servicesData || []);
      setTemplates(templatesData || []);
    } catch (error) {
      console.error('Error fetching presentation data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Presentaciones</h1>
        <Link href="/dashboard/presentations/builder">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Presentación
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Songs Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Music className="mr-2 h-5 w-5" />
              Canciones
            </h2>
            <Link href="/dashboard/presentations/songs">
              <Button variant="outline" size="sm">
                Gestionar
              </Button>
            </Link>
          </div>
          <div className="text-3xl font-bold mb-2">{songs.length}</div>
          <p className="text-sm text-gray-500">Canciones en la biblioteca</p>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Presentation className="mr-2 h-5 w-5" />
              Servicios Recientes
            </h2>
            <Link href="/dashboard/presentations/services">
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {services.slice(0, 3).map((service) => (
              <div key={service.id} className="text-sm">
                <Link 
                  href={`/dashboard/presentations/services/${service.id}`}
                  className="hover:underline"
                >
                  {service.title}
                </Link>
                <div className="text-xs text-gray-500">
                  {new Date(service.date).toLocaleDateString('es-CL')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Templates Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Plantillas
            </h2>
            <Link href="/dashboard/presentations/templates">
              <Button variant="outline" size="sm">
                Gestionar
              </Button>
            </Link>
          </div>
          <div className="text-3xl font-bold mb-2">{templates.length}</div>
          <p className="text-sm text-gray-500">Plantillas disponibles</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/presentations/songs/new">
            <Button variant="outline" className="w-full">
              <Music className="mr-2 h-4 w-4" />
              Agregar Canción
            </Button>
          </Link>
          <Link href="/dashboard/presentations/builder">
            <Button variant="outline" className="w-full">
              <Presentation className="mr-2 h-4 w-4" />
              Crear Presentación
            </Button>
          </Link>
          <Link href="/dashboard/presentations/templates/new">
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Nueva Plantilla
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}