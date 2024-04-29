export type WGAPMinimal = {
  apiVersion: 'wga.kraudcloud.com/v1beta'
  kind: 'WireguardAccessPeer'
  metadata: {
    name: string
  }
  spec: {
    accessRules: string[]
    preSharedKey: string // random 32 bytes to base64
    publicKey: string // some key encryption shit idk
  }
}

export type WGAP = {
  metadata: {
    creationTimestamp: string
  }
  status: {
    address: string
    peers: {
      allowedIPs: string[]
      endpoint: string
      publicKey: string
    }[]
  }
} & WGAPMinimal

export type WGAR = {
  apiVersion: 'wga.kraudcloud.com/v1beta'
  kind: 'WireguardAccessRule'
  metadata: {
    name: string
  }
}
