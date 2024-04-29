import Debug from 'debug'

import { objectsApi } from '@/server/k8s'
import type { WGAP } from '@/types/k8s'
import { error } from '@sveltejs/kit'

const debug = Debug('k8s:api')

export async function load ({ params }) {
  try {
    debug('Getting peer: %s', params.id)
    const res = await objectsApi.getClusterCustomObject('wga.kraudcloud.com', 'v1beta', 'wireguardaccesspeers', params.id)
    return res.body as unknown as WGAP
  } catch (err) {
    debug('Error getting peer: %O', err)
    throw error(500, (err as Error).message)
  }
}
