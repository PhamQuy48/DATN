import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

/**
 * Check authentication from both NextAuth and custom admin session
 * Returns user if authenticated, null otherwise
 *
 * Priority: admin_session cookie takes precedence over NextAuth session
 * to ensure admin users are correctly authenticated as admins
 */
export async function checkAuth(request: NextRequest): Promise<AuthUser | null> {
  // First try custom admin session (higher priority)
  const adminSessionCookie = request.cookies.get('admin_session')
  if (adminSessionCookie?.value) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: adminSessionCookie.value },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          banned: true,
        },
      })

      if (user && !user.banned) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    } catch (error) {
      console.error('Error checking admin session:', error)
    }
  }

  // Then try NextAuth session
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.name!,
      role: session.user.role,
    }
  }

  return null
}
