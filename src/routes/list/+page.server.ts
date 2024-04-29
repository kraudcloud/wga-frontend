import { error } from '@sveltejs/kit'
import Debug from 'debug'

import { objectsApi } from '@/server/k8s'
import type { WGAP, WGAR } from '@/types/k8s'

const debug = Debug('k8s:api')

export async function load () {
  try {
    debug('Listing peers')
    const res = await objectsApi.listClusterCustomObject('wga.kraudcloud.com', 'v1beta', 'wireguardaccesspeers')
    const peers = res.body as unknown as { apiVersion: 'wga.kraudcloud.com/v1beta', items: WGAP[], kind: 'WireguardAccessPeerList', metadata: object }

    debug('Listing roles')
    const { body } = await objectsApi.listClusterCustomObject('wga.kraudcloud.com', 'v1beta', 'wireguardaccessrules')
    const roles = body as unknown as { apiVersion: 'wga.kraudcloud.com/v1beta', items: WGAR[], kind: 'WireguardAccessRuleList', metadata: object }
    return { peers, roles }
  } catch (err) {
    debug('Error listing objects: %O', err)
    throw error(500, (err as Error).message)
  }
}
