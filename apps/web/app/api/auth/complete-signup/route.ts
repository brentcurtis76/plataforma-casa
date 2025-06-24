import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, fullName, organizationName, organizationSlug } = body

    const supabase = await createClient()

    // First, create the organization
    const { data: orgData, error: orgError } = await supabase
      .from('church_organizations')
      .insert({
        name: organizationName,
        slug: organizationSlug,
      })
      .select()
      .single()

    if (orgError) {
      console.error('Error creating organization:', orgError)
      return NextResponse.json(
        { error: 'Error al crear la organización' },
        { status: 400 }
      )
    }

    // Then create the profile linked to the organization
    const { error: profileError } = await supabase
      .from('church_profiles')
      .insert({
        id: userId,
        organization_id: orgData.id,
        role: 'admin', // First user is always admin
        full_name: fullName,
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Try to clean up the organization if profile creation fails
      await supabase.from('church_organizations').delete().eq('id', orgData.id)
      
      return NextResponse.json(
        { error: 'Error al crear el perfil' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Complete signup error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}