import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  fullName: z.string().min(1, 'El nombre es requerido'),
  organizationName: z.string().min(1, 'El nombre de la organización es requerido'),
  organizationSlug: z
    .string()
    .min(3, 'El identificador debe tener al menos 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo se permiten letras minúsculas, números y guiones'),
})

export const inviteUserSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'treasurer', 'presenter', 'member']),
  fullName: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type InviteUserInput = z.infer<typeof inviteUserSchema>