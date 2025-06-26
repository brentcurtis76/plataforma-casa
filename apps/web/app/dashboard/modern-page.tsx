import { createClient } from '@/lib/supabase/server'
import { Users, Calendar, Receipt, Presentation, TrendingUp, Heart, Sparkles, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default async function ModernDashboardPage() {
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
    <div className="min-h-screen relative">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="text-sm text-gray-500 font-medium">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Bienvenido de vuelta
          </h1>
          <p className="text-xl text-gray-600 mt-3">
            {profile?.full_name || 'Administrador'}
          </p>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Stat Card 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-50 group-hover:opacity-70" />
            <div className="relative bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  +12%
                  <TrendingUp className="h-3 w-3" />
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">124</h3>
              <p className="text-sm text-gray-600 mt-1">Miembros Activos</p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-50 group-hover:opacity-70" />
            <div className="relative bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-600">Este mes</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">8</h3>
              <p className="text-sm text-gray-600 mt-1">Eventos Programados</p>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-50 group-hover:opacity-70" />
            <div className="relative bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  +8%
                  <TrendingUp className="h-3 w-3" />
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">$2.45M</h3>
              <p className="text-sm text-gray-600 mt-1">Ingresos del Mes</p>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-50 group-hover:opacity-70" />
            <div className="relative bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <Presentation className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">Total</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">32</h3>
              <p className="text-sm text-gray-600 mt-1">Presentaciones</p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-12">
          {/* Accounting Card */}
          <Link href="/dashboard/accounting" className="group">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300" />
              <div className="relative bg-white rounded-3xl p-8 h-full shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                    <Receipt className="h-8 w-8 text-white" />
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Contabilidad</h3>
                <p className="text-gray-600 mb-6">
                  Sistema completo de gestión financiera con reportes en tiempo real y análisis detallado.
                </p>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300" />
              <div className="relative bg-white rounded-3xl p-8 h-full shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                    <Presentation className="h-8 w-8 text-white" />
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Presentaciones</h3>
                <p className="text-gray-600 mb-6">
                  Crea hermosas presentaciones con canciones, versículos y contenido multimedia.
                </p>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    32 activas
                  </span>
                  <span className="text-sm text-gray-500">5 borradores</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Meditation Card - Featured */}
          <Link href="/dashboard/meditation" className="group">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-3xl blur-sm group-hover:blur-md transition-all duration-300 animate-pulse" />
              <div className="relative bg-white rounded-3xl p-8 h-full shadow-xl border-2 border-orange-200">
                <div className="absolute -top-3 -right-3">
                  <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Nuevo
                  </span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl animate-float">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Meditación con IA</h3>
                <p className="text-gray-600 mb-6">
                  Experiencias de meditación personalizadas guiadas por inteligencia artificial.
                </p>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-sm font-medium">
                    IA Powered
                  </span>
                  <span className="text-sm text-gray-500">Pruébalo ahora</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Nuevo Miembro</span>
              </div>
            </button>
            
            <button className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Crear Evento</span>
              </div>
            </button>
            
            <button className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Nueva Transacción</span>
              </div>
            </button>
            
            <button className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Presentation className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Nueva Presentación</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}