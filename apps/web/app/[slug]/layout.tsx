import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ChurchLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  
  // Check if this is a valid church slug
  const { data: organization } = await supabase
    .from('church_organizations')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (!organization) {
    notFound()
  }

  return (
    <html lang="es" className="casa-theme">
      <body className="font-mont antialiased">
        {children}
      </body>
    </html>
  )
}