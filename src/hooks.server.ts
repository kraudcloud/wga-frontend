import { sequence } from '@sveltejs/kit/hooks'
import { error, type Handle } from '@sveltejs/kit'
import Debug from 'debug'

import { handle as auth } from './auth.ts'

const debug = Debug('auth:hook')

const PROTECTED_ROUTES = ['/list', '/api']

const protectedRoutes: Handle = async ({ event, resolve }) => {
  const isProtected = PROTECTED_ROUTES.some(route => event.url.pathname.startsWith(route))

  if (isProtected) {
    debug('Entering protected route')
    const session = await event.locals.auth()

    // @ts-expect-error - Add groups to session
    if (!session?.user) {
      debug('Not authorized')
      throw error(401, 'Unauthorized')
    }
  }

  return await resolve(event)
}

export const handle = sequence(auth, protectedRoutes)
