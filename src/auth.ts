import { SvelteKitAuth } from '@auth/sveltekit'
import Authentik from '@auth/core/providers/authentik'
import Debug from 'debug'

import { env } from '$env/dynamic/private'

const debug = Debug('auth:hook')

debug('Initiating OAuth provider')
export const { handle, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  providers: [
    Authentik({
      clientId: env.AUTHENTIK_ID,
      clientSecret: env.AUTHENTIK_SECRET,
      issuer: env.AUTHENTIK_ISSUER,
      authorization: env.AUTHENTIK_AUTHORIZATION,
      profile: profile => profile
    })
  ],
  callbacks: {
    jwt ({ token, user }) {
      // @ts-expect-error - Add groups to token
      if (user && token) token.groups = user.groups
      return token
    },
    session ({ session, token }) {
      // @ts-expect-error - Add groups to session
      if (session?.user && token?.groups) session.user.groups = token.groups
      return session
    }
  },
  secret: env.AUTH_SECRET
})
