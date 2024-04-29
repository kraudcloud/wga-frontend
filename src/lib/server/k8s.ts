import k8s from '@kubernetes/client-node'

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

export const objectsApi = kc.makeApiClient(k8s.CustomObjectsApi)
