'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Label } from '@/lib/ui';
import { ArrowLeft, Plus, Trash2, GripVertical, Music, Type, Image, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Slide {
  id: string;
  type: 'song' | 'scripture' | 'announcement' | 'image' | 'prayer';
  content: any;
}

interface Song {
  id: string;
  title: string;
  artist: string | null;
  lyrics: string;
}

function SortableSlide({ slide, onRemove, onEdit }: { slide: Slide; onRemove: () => void; onEdit: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getSlideIcon = () => {
    switch (slide.type) {
      case 'song':
        return <Music className="h-4 w-4" />;
      case 'scripture':
        return <FileText className="h-4 w-4" />;
      case 'announcement':
        return <Type className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'prayer':
        return <Type className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getSlideTitle = () => {
    switch (slide.type) {
      case 'song':
        return slide.content.title || 'Canción';
      case 'scripture':
        return slide.content.reference || 'Escritura';
      case 'announcement':
        return 'Anuncio';
      case 'image':
        return 'Imagen';
      case 'prayer':
        return 'Oración';
      default:
        return 'Diapositiva';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-4 flex items-center gap-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </button>
      
      <div className="flex-1 flex items-center gap-3">
        {getSlideIcon()}
        <span className="font-medium">{getSlideTitle()}</span>
        {slide.type === 'song' && slide.content.artist && (
          <span className="text-sm text-gray-500">- {slide.content.artist}</span>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
        >
          Editar
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function PresentationBuilderPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [showAddSlide, setShowAddSlide] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const { data, error } = await supabase
      .from('church_songs')
      .select('id, title, artist, lyrics')
      .order('title');

    if (!error && data) {
      setSongs(data);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSlides((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addSlide = (type: Slide['type']) => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type,
      content: {},
    };

    if (type === 'song') {
      // Open song selector
      // For now, we'll add an empty song slide
      newSlide.content = { title: 'Seleccionar canción' };
    }

    setSlides([...slides, newSlide]);
    setShowAddSlide(false);
  };

  const removeSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id));
  };

  const handleSave = async () => {
    if (!title || slides.length === 0) {
      alert('Por favor, ingresa un título y agrega al menos una diapositiva');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profile } = await supabase
        .from('church_profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { error } = await supabase
        .from('church_services')
        .insert({
          organization_id: profile.organization_id,
          title,
          date,
          slides: slides,
          created_by: user.id,
        });

      if (error) throw error;

      router.push('/dashboard/presentations');
    } catch (error) {
      console.error('Error saving presentation:', error);
      alert('Error al guardar la presentación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/presentations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Presentaciones
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Nueva Presentación</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="title">Título del Servicio *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Servicio Dominical"
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Fecha *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Diapositivas</h2>
          {!showAddSlide && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddSlide(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Diapositiva
            </Button>
          )}
        </div>

        {showAddSlide && (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Seleccionar tipo de diapositiva:</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => addSlide('song')}
                className="flex flex-col gap-2 h-20"
              >
                <Music className="h-5 w-5" />
                <span className="text-xs">Canción</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => addSlide('scripture')}
                className="flex flex-col gap-2 h-20"
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">Escritura</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => addSlide('announcement')}
                className="flex flex-col gap-2 h-20"
              >
                <Type className="h-5 w-5" />
                <span className="text-xs">Anuncio</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => addSlide('image')}
                className="flex flex-col gap-2 h-20"
              >
                <Image className="h-5 w-5" />
                <span className="text-xs">Imagen</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => addSlide('prayer')}
                className="flex flex-col gap-2 h-20"
              >
                <Type className="h-5 w-5" />
                <span className="text-xs">Oración</span>
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAddSlide(false)}
              className="mt-3"
            >
              Cancelar
            </Button>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slides}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {slides.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay diapositivas. Haz clic en "Agregar Diapositiva" para comenzar.
                </div>
              ) : (
                slides.map((slide) => (
                  <SortableSlide
                    key={slide.id}
                    slide={slide}
                    onRemove={() => removeSlide(slide.id)}
                    onEdit={() => {
                      // TODO: Implement edit functionality
                      console.log('Edit slide:', slide.id);
                    }}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Link href="/dashboard/presentations">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </Link>
        <Button
          onClick={handleSave}
          disabled={loading || !title || slides.length === 0}
        >
          {loading ? 'Guardando...' : 'Guardar Presentación'}
        </Button>
      </div>
    </div>
  );
}