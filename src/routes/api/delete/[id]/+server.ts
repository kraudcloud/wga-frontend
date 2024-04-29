import { json } from '@sveltejs/kit'
import Debug from 'debug'

import { objectsApi } from '@/server/k8s'

const debug = Debug('k8s:api')

export async function GET ({ params }) {
  try {
    debug('Deleting peer: %s', params.id)
    await objectsApi.deleteClusterCustomObject('wga.kraudcloud.com', 'v1beta', 'wireguardaccesspeers', params.id)

    return json({ status: 'ok' })
  } catch (error) {
    debug('Error deleting peer: %O', error)
    return json({ error })
  }
}
