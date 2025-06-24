import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { SkipLinks } from '@/components/meditation/Accessibility'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    <>
      <SkipLinks />
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {profile?.organization?.name || 'Church Admin'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {profile?.full_name || user.email}
                  </p>
                </div>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="text-sm text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6" id="main-content">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}