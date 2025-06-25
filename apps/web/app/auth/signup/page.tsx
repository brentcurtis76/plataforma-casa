'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@church-admin/ui'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@church-admin/ui'
import { Input } from '@church-admin/ui'
import { Label } from '@church-admin/ui'
import { signUpSchema, type SignUpInput } from '@church-admin/shared'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orgSlug, setOrgSlug] = useState('')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data: SignUpInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
      organizationName: formData.get('organizationName') as string,
      organizationSlug: formData.get('organizationSlug') as string,
    }

    try {
      const validatedData = signUpSchema.parse(data)
      const supabase = createClient()
      
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (!authData.user) {
        setError('Error al crear la cuenta')
        return
      }

      // Create organization and profile through API
      const response = await fetch('/api/auth/complete-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authData.user.id,
          fullName: validatedData.fullName,
          organizationName: validatedData.organizationName,
          organizationSlug: validatedData.organizationSlug,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Error al completar el registro')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Crear cuenta</CardTitle>
        <CardDescription>
          Registra tu iglesia y crea tu cuenta de administrador
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@iglesia.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Información de la iglesia</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="organizationName">Nombre de la iglesia</Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    placeholder="Iglesia Bautista Central"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="organizationSlug">Identificador único</Label>
                  <Input
                    id="organizationSlug"
                    name="organizationSlug"
                    type="text"
                    placeholder="iglesia-bautista-central"
                    pattern="^[a-z0-9-]+$"
                    onChange={(e) => setOrgSlug(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Será usado en la URL: {orgSlug || 'tu-iglesia'}.church-admin.cl
                  </p>
                </div>
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
          <div className="text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" className="underline">
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}