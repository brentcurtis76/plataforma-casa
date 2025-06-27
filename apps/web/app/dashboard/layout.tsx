import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { SkipLinks } from '@/components/meditation/Accessibility'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // DEVELOPMENT MODE: Skip authentication
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment) {
    // Mock user and profile for development
    const mockProfile = {
      full_name: 'Brent Curtis (Dev Mode)',
      role: 'admin',
      organization: {
        name: 'CASA Development'
      }
    }
    
    return (
      <div style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}>
        <div className="min-h-screen bg-white flex">
          <Sidebar />
          
          <div className="flex-1 flex flex-col">
            <header className="bg-white shadow-sm border-b border-gray-100">
              <div className="px-8">
                <div className="flex justify-between items-center py-6">
                  <div>
                    <h1 className="text-3xl font-light text-black tracking-tight">
                      Plataforma de Administración
                    </h1>
                    <p className="text-sm text-gray-600 font-light mt-1">
                      Iglesia Anglicana San Andrés (DEV MODE)
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">BC</span>
                    </div>
                    <button className="text-sm font-medium text-gray-700 hover:text-black px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
                      Dev Mode
                    </button>
                  </div>
                </div>
              </div>
            </header>
            
            <main className="flex-1 p-8" id="main-content">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

  // Production auth logic
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
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
    <div style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}>
      <SkipLinks />
      <div className="min-h-screen bg-white flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="px-8">
              <div className="flex justify-between items-center py-6">
                <div>
                  <h1 className="text-3xl font-light text-black tracking-tight">
                    Plataforma de Administración
                  </h1>
                  <p className="text-sm text-gray-600 font-light mt-1">
                    Iglesia Anglicana San Andrés
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {(profile?.full_name || user.email)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <form action="/api/auth/logout" method="post">
                    <button
                      type="submit"
                      className="text-sm font-medium text-gray-700 hover:text-black px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Cerrar sesión
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-8" id="main-content">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}