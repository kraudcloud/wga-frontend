import { redirect } from '@sveltejs/kit'
import Debug from 'debug'

import { signIn } from '../auth.js'

const debug = Debug('auth:session')

export async function load ({ locals }) {
  const session = await locals.auth()
  if (session?.user) {
    debug('Session found, redirecting to /list')
    return redirect(302, '/list')
  }
}

export const actions = { default: signIn }
