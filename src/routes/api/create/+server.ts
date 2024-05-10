import { json } from '@sveltejs/kit'
import Debug from 'debug'

import { objectsApi } from '@/server/k8s'
import type { WGAP, WGAPMinimal } from '@/types/k8s'
import { sleep } from '@/utils'

const debug = Debug('k8s:api')

export async function POST ({ request }) {
  try {
    const { name, accessRules, publicKey, preSharedKey }: { name: string, accessRules: string[], publicKey: string, preSharedKey: string } = await request.json()

    const object: WGAPMinimal = {
      apiVersion: 'wga.kraudcloud.com/v1beta',
      kind: 'WireguardAccessPeer',
      metadata: { name },
      spec: {
        accessRules,
        preSharedKey,
        publicKey
      }
    }

    debug('Creating peer: %O', { name, accessRules, publicKey })

    await objectsApi.createClusterCustomObject('wga.kraudcloud.com', 'v1beta', 'wireguardaccesspeers', object)

    while (true) {
      await sleep(100)
      const res = await objectsApi.getClusterCustomObject('wga.kraudcloud.com', 'v1beta', 'wireguardaccesspeers', name)
      const data = res.body as unknown as WGAP
      if (data.status.peers?.[0]?.publicKey) {
        debug('Public key found, peer created')
        return json({ status: 'ok' })
      }
    }
  } catch (error) {
    debug('Error creating peer: %O', error)
    return json({ error })
  }
}
