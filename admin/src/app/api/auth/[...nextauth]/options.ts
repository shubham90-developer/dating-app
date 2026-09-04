import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email:',
          type: 'text',
          placeholder: 'Enter your username',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Email or Password is not valid')
        }

        // Return the real admin + real backend-signed JWT
        return {
          id: data.data._id,
          email: data.data.email,
          name: data.data.name,
          role: data.data.role,
          token: data.token,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async signIn() {
      return true
    },
    async jwt({ token, user }) {
      // On initial sign-in, `user` is what authorize() returned above
      if (user) {
        token.accessToken = (user as any).token
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        email: token.email as string,
        name: token.name as string,
      }
      session.accessToken = token.accessToken as string
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours, in seconds
  },
}
