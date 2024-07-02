<script lang='ts'>
  import qrcode from 'qrcode'

  import { browser } from '$app/environment'
  import { Button } from '$lib/components/ui/button'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  export let data

  const [priv, pre] = $page.url.hash.slice(1).split('|')

  const config = `[Interface]
PrivateKey = ${decodeURIComponent(priv)}
Address = ${data.status.address}

[Peer]
PresharedKey = ${decodeURIComponent(pre)}
PublicKey = ${data.status.peers[0].publicKey}
AllowedIPs = ${data.status.peers[0].allowedIPs.join(',')}
Endpoint = ${data.status.peers[0].endpoint}
`.replaceAll(/\r?\n/g, '\r\n')

  let src = ''

  function download () {
    const blob = new Blob([config], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.metadata.name}.conf`
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  if (!$page.url.hash) {
    goto('/')
  } else if (browser) {
    qrcode.toDataURL(config, { errorCorrectionLevel: 'M', type: 'image/png' }).then(url => { src = url })
  }
</script>

<div class='w-full h-screen flex justify-center items-center flex-col'>
  <div class='w-[16rem] max-w-full p-3'>
    <div class='text-2xl font-semibold'>Hello <span class='text-slate-500'>{data.metadata.name}</span>!</div>
    <div class='text-sm font-semibold mt-5 mb-2'>
      Scan the QR code or download the configuration file to get started.
    </div>
    <img {src} alt='qr-code' style:image-rendering='pixelated' class='aspect-square w-full' />
    <Button class='w-full mt-2' on:click={download}>Download</Button>
  </div>
</div>
