import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChurchHeader from '@/components/church/Header'
import ChurchHero from '@/components/church/Hero'
import ChurchFooter from '@/components/church/Footer'

export default async function ChurchHomePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  
  // Get organization data
  const { data: organization } = await supabase
    .from('church_organizations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!organization) {
    notFound()
  }

  // Get current user (if any)
  const { data: { user } } = await supabase.auth.getUser()

  // Get church website data
  const [
    { data: heroSection },
    { data: aboutSection },
    { data: contactInfo },
    { data: schedules },
    { data: events },
    { data: teamMembers },
  ] = await Promise.all([
    supabase
      .from('church_hero_sections')
      .select('*')
      .eq('organization_id', organization.id)
      .single(),
    supabase
      .from('church_about_sections')
      .select('*')
      .eq('organization_id', organization.id)
      .single(),
    supabase
      .from('church_contact_info')
      .select('*')
      .eq('organization_id', organization.id)
      .single(),
    supabase
      .from('church_schedules')
      .select('*')
      .eq('organization_id', organization.id)
      .order('day_of_week'),
    supabase
      .from('church_events')
      .select('*')
      .eq('organization_id', organization.id)
      .eq('is_published', true)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date')
      .limit(3),
    supabase
      .from('church_team_members')
      .select('*')
      .eq('organization_id', organization.id)
      .order('order_index'),
  ])

  // Format schedule for footer
  const formattedSchedule = schedules?.map(schedule => ({
    day: getDayName(schedule.day_of_week),
    time: schedule.time,
    service: schedule.service_name,
  })) || []

  return (
    <>
      <ChurchHeader organizationSlug={slug} user={user} />
      
      <main>
        {/* Hero Section */}
        <ChurchHero
          welcomeBadge={heroSection?.welcome_badge}
          headline={heroSection?.headline || organization.name}
          subheadline={heroSection?.subheadline}
          ctaPrimaryText={heroSection?.cta_primary_text}
          ctaPrimaryLink={heroSection?.cta_primary_link}
          ctaSecondaryText={heroSection?.cta_secondary_text}
          ctaSecondaryLink={heroSection?.cta_secondary_link}
        />

        {/* About Section */}
        {aboutSection && (
          <section id="proposito" className="py-24 bg-casa-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-casa-900 sm:text-4xl">
                  {aboutSection.title || 'Nuestro Propósito'}
                </h2>
                <p className="mt-6 text-lg leading-8 text-casa-600 whitespace-pre-wrap">
                  {aboutSection.content}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Team Section */}
        {teamMembers && teamMembers.length > 0 && (
          <section id="equipo" className="py-24 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-casa-900 sm:text-4xl">
                  Nuestro Equipo
                </h2>
                <p className="mt-4 text-lg text-casa-600">
                  Conoce a las personas que sirven en nuestra comunidad
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="text-center">
                    {member.image_url && (
                      <img
                        className="mx-auto h-32 w-32 rounded-full object-cover"
                        src={member.image_url}
                        alt={member.name}
                      />
                    )}
                    <h3 className="mt-6 text-lg font-semibold leading-7 tracking-tight text-casa-900">
                      {member.name}
                    </h3>
                    <p className="text-sm leading-6 text-casa-600">{member.role}</p>
                    {member.bio && (
                      <p className="mt-2 text-sm text-casa-500">{member.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Events Section */}
        {events && events.length > 0 && (
          <section id="eventos" className="py-24 bg-casa-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-casa-900 sm:text-4xl">
                  Próximos Eventos
                </h2>
                <p className="mt-4 text-lg text-casa-600">
                  Únete a nosotros en estas actividades especiales
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm p-6">
                    <time className="text-sm text-casa-500">
                      {new Date(event.date).toLocaleDateString('es-CL', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <h3 className="mt-2 text-lg font-semibold text-casa-900">
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="mt-1 text-sm text-casa-600">📍 {event.location}</p>
                    )}
                    {event.description && (
                      <p className="mt-2 text-sm text-casa-500">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Participate Section */}
        <section id="participar" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-casa-900 sm:text-4xl">
                Participa con Nosotros
              </h2>
              <p className="mt-4 text-lg text-casa-600">
                Hay muchas formas de ser parte de nuestra comunidad
              </p>
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-casa-200 p-6">
                  <h3 className="font-semibold text-casa-900">Servicios Dominicales</h3>
                  <p className="mt-2 text-sm text-casa-600">
                    Únete a nosotros cada domingo para adoración y enseñanza
                  </p>
                </div>
                <div className="rounded-lg border border-casa-200 p-6">
                  <h3 className="font-semibold text-casa-900">Grupos Pequeños</h3>
                  <p className="mt-2 text-sm text-casa-600">
                    Conecta con otros en grupos de estudio y comunidad
                  </p>
                </div>
                <div className="rounded-lg border border-casa-200 p-6">
                  <h3 className="font-semibold text-casa-900">Voluntariado</h3>
                  <p className="mt-2 text-sm text-casa-600">
                    Sirve en diferentes ministerios según tus dones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ChurchFooter
        organizationName={organization.name}
        organizationSlug={slug}
        contact={{
          address: contactInfo?.address,
          phone: contactInfo?.phone,
          email: contactInfo?.email,
        }}
        schedule={formattedSchedule}
      />
    </>
  )
}

function getDayName(dayNumber: number): string {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return days[dayNumber] || ''
}