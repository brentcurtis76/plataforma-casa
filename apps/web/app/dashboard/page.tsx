import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@church-admin/ui'
import { Users, Calendar, Receipt, Presentation } from 'lucide-react'

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
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Bienvenido de vuelta
        </h2>
        <p className="text-gray-600 mt-1">
          Aquí está el resumen de tu iglesia para hoy
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Miembros Activos
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    124
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Eventos Este Mes
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    8
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Receipt className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ingresos del Mes
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    $2,450,000
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Presentation className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Presentaciones
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    32
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contabilidad</CardTitle>
            <CardDescription>
              Gestiona las finanzas de tu iglesia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Registro de transacciones, reportes financieros y más.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Presentaciones</CardTitle>
            <CardDescription>
              Crea y gestiona presentaciones para servicios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Constructor de diapositivas con canciones y versículos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meditación</CardTitle>
            <CardDescription>
              Meditaciones guiadas con IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Genera meditaciones personalizadas basadas en escrituras.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}