import { createClient } from '@/lib/supabase/server'
import { Users, Calendar, Receipt, Presentation, TrendingUp, Heart, Sparkles, ArrowUpRight, ChevronDown, BarChart3, Clock } from 'lucide-react'
import Link from 'next/link'
import styles from './Dashboard.module.css'
import { ProgressiveDisclosure } from '@/components/dashboard/ProgressiveDisclosure'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Get user profile and organization
  const { data: profile } = await supabase
    .from('church_profiles')
    .select(`
      *,
      organization:church_organizations(*)
    `)
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-8" style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}>
      {/* Subtle background pattern */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
        <div className={`absolute top-0 -left-4 w-96 h-96 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-5 ${styles.animateBlob}`} />
        <div className={`absolute top-0 -right-4 w-96 h-96 bg-gray-900 rounded-full mix-blend-multiply filter blur-3xl opacity-3 ${styles.animateBlob} ${styles.animationDelay2000}`} />
        <div className={`absolute -bottom-8 left-20 w-96 h-96 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-4 ${styles.animateBlob} ${styles.animationDelay4000}`} />
      </div>
      
      {/* Modern Header */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
        
        <h1 className="text-6xl font-light text-black tracking-tight">
          Bienvenido de vuelta
        </h1>
        <p className="text-2xl text-gray-600 mt-4 font-light">
          {profile?.full_name || 'Administrador'}
        </p>
      </div>

      {/* Hero Statistics - Improved Visual Hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Primary Hero Card - Revenue (2x larger) */}
        <div className="lg:col-span-2 group relative">
            <div className="absolute inset-0 bg-black rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700 opacity-10 group-hover:opacity-15" />
            <div className="relative bg-white rounded-3xl p-12 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-500">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-black rounded-2xl">
                    <Receipt className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-6xl font-light text-black tracking-tight">$2.45M</h2>
                    <p className="text-xl text-gray-600 mt-2 font-light">Ingresos del Mes</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    +8.2%
                  </span>
                  <p className="text-sm text-gray-500 mt-2">vs. mes anterior</p>
                </div>
              </div>
              
              {/* Contextual Insight */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-black rounded-full" />
                  <span className="text-sm font-medium text-gray-900">Análisis Inteligente</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Excelente progreso. Los ingresos han aumentado un 8.2% comparado con el mes anterior, 
                  principalmente por el incremento en diezmos y ofrendas especiales.
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Stats Column */}
          <div className="space-y-6">
            {/* Members Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-black rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-5 group-hover:opacity-10" />
              <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-black rounded-xl">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 flex items-center gap-1">
                    +12%
                    <TrendingUp className="h-3 w-3" />
                  </span>
                </div>
                <h3 className="text-2xl font-light text-black">124</h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">Miembros Activos</p>
              </div>
            </div>

            {/* Events Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gray-900 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-5 group-hover:opacity-10" />
              <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-900 rounded-xl">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Este mes</span>
                </div>
                <h3 className="text-2xl font-light text-black">8</h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">Eventos Programados</p>
              </div>
            </div>

            {/* Presentations Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-black rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-5 group-hover:opacity-10" />
              <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-black rounded-xl">
                    <Presentation className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Total</span>
                </div>
                <h3 className="text-2xl font-light text-black">32</h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">Presentaciones</p>
              </div>
            </div>
        </div>
      </div>

      {/* Weekly Insights Panel */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-100 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light text-black">Resumen Semanal</h2>
            <span className="text-sm text-gray-500">21-27 Junio</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-light text-black mb-2">87%</div>
              <div className="text-sm text-gray-600">Asistencia Promedio</div>
              <div className="text-xs text-gray-500 mt-1">+5% vs. semana anterior</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-light text-black mb-2">$45K</div>
              <div className="text-sm text-gray-600">Ofrendas Semanales</div>
              <div className="text-xs text-gray-500 mt-1">Meta: $40K alcanzada</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-light text-black mb-2">3</div>
              <div className="text-sm text-gray-600">Nuevos Miembros</div>
              <div className="text-xs text-gray-500 mt-1">Bautizados esta semana</div>
            </div>
          </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-16">
          {/* Accounting Card */}
          <Link href="/dashboard/accounting" className="group">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-black rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500 opacity-5" />
              <div className="relative bg-white rounded-3xl p-10 h-full shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-black rounded-2xl">
                    <Receipt className="h-8 w-8 text-white" />
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-3xl font-light text-black mb-4">Contabilidad</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Sistema completo de gestión financiera con reportes en tiempo real y análisis detallado.
                </p>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-gray-100 text-gray-900 rounded-full text-sm font-medium">
                    Actualizado
                  </span>
                  <span className="text-sm text-gray-500">Hace 2 horas</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Presentations Card */}
          <Link href="/dashboard/presentations" className="group">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gray-900 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-500 opacity-5" />
              <div className="relative bg-white rounded-3xl p-10 h-full shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-gray-900 rounded-2xl">
                    <Presentation className="h-8 w-8 text-white" />
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-3xl font-light text-black mb-4">Presentaciones</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Crea hermosas presentaciones con canciones, versículos y contenido multimedia.
                </p>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-gray-100 text-gray-900 rounded-full text-sm font-medium">
                    32 activas
                  </span>
                  <span className="text-sm text-gray-500">5 borradores</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Meditation Card - Featured with subtle emphasis */}
          <Link href="/dashboard/meditation" className="group">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-black rounded-3xl blur-sm group-hover:blur-md transition-all duration-500 opacity-10 group-hover:opacity-15" />
              <div className="relative bg-white rounded-3xl p-10 h-full shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-4 -right-4">
                  <span className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Nuevo
                  </span>
                </div>
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 bg-black rounded-2xl ${styles.animateFloat}`}>
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-3xl font-light text-black mb-4">Meditación con IA</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Experiencias de meditación personalizadas guiadas por inteligencia artificial.
                </p>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
                    IA Powered
                  </span>
                  <span className="text-sm text-gray-500">Pruébalo ahora</span>
                </div>
              </div>
            </div>
          </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-light text-black mb-8">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group border border-gray-100">
              <div className="text-center">
                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Nuevo Miembro</span>
              </div>
            </button>
            
            <button className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group border border-gray-100">
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Crear Evento</span>
              </div>
            </button>
            
            <button className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group border border-gray-100">
              <div className="text-center">
                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Receipt className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Nueva Transacción</span>
              </div>
            </button>
            
            <button className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group border border-gray-100">
              <div className="text-center">
                <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Presentation className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Nueva Presentación</span>
              </div>
            </button>
          </div>
      </div>

      {/* Progressive Disclosure - Advanced Analytics */}
      <ProgressiveDisclosure 
          title="Analytics Avanzados" 
          subtitle="Métricas detalladas y tendencias históricas"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Growth Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-black rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-black">Crecimiento</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nuevos miembros (30d)</span>
                  <span className="text-sm font-medium text-black">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasa de retención</span>
                  <span className="text-sm font-medium text-black">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Asistencia promedio</span>
                  <span className="text-sm font-medium text-black">87%</span>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-900 rounded-lg">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-black">Finanzas</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Diezmos este mes</span>
                  <span className="text-sm font-medium text-black">$1.8M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ofrendas especiales</span>
                  <span className="text-sm font-medium text-black">$650K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gastos operacionales</span>
                  <span className="text-sm font-medium text-black">$420K</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-black rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-black">Actividad Reciente</h3>
              </div>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="text-gray-900 font-medium">Nuevo miembro registrado</div>
                  <div className="text-gray-500">hace 2 horas</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-900 font-medium">Evento creado: Culto Juvenil</div>
                  <div className="text-gray-500">hace 4 horas</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-900 font-medium">Donación procesada: $50K</div>
                  <div className="text-gray-500">hace 6 horas</div>
                </div>
              </div>
            </div>
          </div>
      </ProgressiveDisclosure>
    </div>
  )
}