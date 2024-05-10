import { SvelteKitAuth } from '@auth/sveltekit'
import Authentik from '@auth/core/providers/authentik'
import Debug from 'debug'

import { env } from '$env/dynamic/private'

const debug = Debug('auth:hook')

debug('Initiating OAuth provider')
export const { handle, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  providers: [
    Authentik({ clientId: env.AUTHENTIK_ID, clientSecret: env.AUTHENTIK_SECRET, issuer: env.AUTHENTIK_DOMAIN + '/application/o/wga/', authorization: env.AUTHENTIK_DOMAIN + '/application/o/authorize/' })
  ],
  secret: env.AUTH_SECRET
})
