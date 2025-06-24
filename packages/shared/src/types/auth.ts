export type UserRole = 'admin' | 'treasurer' | 'presenter' | 'member'

export interface User {
  id: string
  email: string
  role: UserRole
  organizationId: string
  fullName: string | null
  createdAt: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  settings: {
    timezone?: string
    currency?: string
    language?: string
    features?: {
      accounting: boolean
      presentations: boolean
      meditation: boolean
    }
  }
  createdAt: string
}

export interface Session {
  user: User
  organization: Organization
  accessToken: string
  refreshToken: string
}