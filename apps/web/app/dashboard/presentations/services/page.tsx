'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/lib/ui';
import { Calendar, Search, Presentation, Edit, Trash2, Copy } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  date: string;
  slides: any[];
  created_at: string;
  created_by: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Filter services based on search term
    const filtered = services.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(service.date).toLocaleDateString('es-CL').includes(searchTerm)
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('church_services')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setServices(data || []);
      setFilteredServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este servicio?')) return;

    try {
      const { error } = await supabase
        .from('church_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setServices(services.filter(service => service.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error al eliminar el servicio');
    }
  };

  const handleDuplicate = async (service: Service) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profile } = await supabase
        .from('church_profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      // Create a copy with new date
      const newService = {
        organization_id: profile.organization_id,
        title: `${service.title} (Copia)`,
        date: new Date().toISOString().split('T')[0],
        slides: service.slides,
        created_by: user.id,
      };

      const { error } = await supabase
        .from('church_services')
        .insert(newService);

      if (error) throw error;

      // Refresh the list
      fetchServices();
      alert('Servicio duplicado exitosamente');
    } catch (error) {
      console.error('Error duplicating service:', error);
      alert('Error al duplicar el servicio');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando servicios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Servicios y Presentaciones</h1>
        <Link href="/dashboard/presentations/builder">
          <Button>
            <Presentation className="mr-2 h-4 w-4" />
            Nueva Presentación
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar por título o fecha..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha
                </div>
              </TableHead>
              <TableHead>Diapositivas</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  {searchTerm
                    ? 'No se encontraron servicios que coincidan con la búsqueda'
                    : 'No hay servicios creados'}
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>
                    {new Date(service.date).toLocaleDateString('es-CL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{service.slides.length} diapositivas</TableCell>
                  <TableCell>
                    {new Date(service.created_at).toLocaleDateString('es-CL')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/presentations/present/${service.id}`}>
                        <Button variant="outline" size="sm">
                          <Presentation className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/presentations/services/${service.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(service)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
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