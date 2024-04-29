import Debug from 'debug'

import { env } from '$env/dynamic/private'

const debug = Debug('auth:session')
Debug.enable(env.DEBUG || '')

// turn off SSR - we're JAMstack here
export const ssr = false
// Prerendering turned off. Turn it on if you know what you're doing.
export const prerender = false
// trailing slashes make relative paths much easier
export const trailingSlash = 'always'

export async function load ({ locals }) {
  debug('Loading session')
  return {
    session: await locals.auth(),
    debug: env.DEBUG || ''
  }
}
