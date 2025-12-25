import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // TODO: Uncomment Google OAuth sau khi cấu hình xong (xem file GOOGLE_OAUTH_SETUP.md)
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || '',
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    // }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email và mật khẩu là bắt buộc')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('Email hoặc mật khẩu không đúng')
        }

        // Check if user is banned
        if (user.banned) {
          throw new Error('Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Email hoặc mật khẩu không đúng')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // On initial sign in or when triggered, get fresh user data
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Refresh user data from database on each request to ensure role is up-to-date
      if (token.id && !user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { id: true, email: true, name: true, role: true, banned: true }
        })

        // If user is banned or deleted, clear token data to force logout
        if (!dbUser || dbUser.banned) {
          return { ...token, id: undefined, role: undefined, email: undefined, name: undefined } as any
        }

        if (dbUser) {
          token.id = dbUser.id
          token.email = dbUser.email
          token.name = dbUser.name
          token.role = dbUser.role
        }
      }

      if (account?.provider === 'google') {
        token.provider = 'google'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.provider = token.provider as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
}
