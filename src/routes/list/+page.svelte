<script lang='ts'>
  import { signOut } from '@auth/sveltekit/client'
  import { utils, getPublicKeyAsync } from '@noble/ed25519'
  import { arr2base } from 'uint8-util'
  import Debug from 'debug'

  import { Button } from '$lib/components/ui/button'
  import { Root, Trigger, Content } from '$lib/components/ui/popover'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import * as Select from '$lib/components/ui/select'
  import * as Card from '$lib/components/ui/card'
  import { goto, invalidateAll } from '$app/navigation'

  const debugAuth = Debug('auth:session')
  const debugK8s = Debug('k8s:client')

  function signout () {
    debugAuth('Requesting sign-out')
    signOut()
  }

  export let data

  async function deleteObject (id: string) {
    try {
      debugK8s('Deleting object %s', id)
      const res = await fetch('/api/delete/' + id)

      if (!res.ok) throw new Error('Failed to delete object.\n' + await res.text())

      await invalidateAll()
    } catch (err) {
      debugK8s('Failed to create object %O', err as Error)
    }
  }

  $: peers = data.peers

  let name: string = ''
  let accessRules: { value: string, label: string }[] = []

  async function createObject () {
    try {
      debugK8s('Creating object %s', name)
      const privKeyUint8 = utils.randomPrivateKey()
      const pubKeyUint8 = await getPublicKeyAsync(privKeyUint8)

      const publicKey = arr2base(pubKeyUint8)

      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, accessRules: accessRules.map(({ value }) => value), publicKey })
      })

      if (!res.ok) throw new Error('Failed to create object.\n' + await res.text())

      await invalidateAll()

      debugK8s('Created object. Redirecting')

      goto(`/view/${name}#${arr2base(privKeyUint8)}`)
    } catch (err) {
      debugK8s('Failed to create object %O', err as Error)
    }
  }
</script>

<header class='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
  <div class='container flex h-14 max-w-screen-2xl items-center'>
    <div class='font-semibold text-xl'>Devices</div>
    <Root>
      <Trigger class='ml-auto'>
        <Button>New device</Button>
      </Trigger>
      <Content class='flex flex-col'>
        <div class='font-bold'>New device</div>
        <div class='text-gray-400 text-sm'>Enter required information for the device</div>
        <Label for='name' class='pb-2 pt-5'>Device Name</Label>
        <Input type='text' id='name' placeholder='Name' bind:value={name} />
        <Label class='pb-2 pt-5'>Roles</Label>
        <Select.Root multiple bind:selected={accessRules}>
          <Select.Trigger>
            <Select.Value placeholder='Select an option' />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each data.roles.items as role}
                <Select.Item value={role.metadata.name} label={role.metadata.name}>
                  {role.metadata.name}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
          <Select.Input />
        </Select.Root>
        <Button class='mt-5' on:click={createObject}>Confirm</Button>
      </Content>
    </Root>
    <Button class='ml-2' on:click={signout}>Sign Out</Button>
  </div>
</header>

<div>
  <div class='container grid grid-cols-[repeat(auto-fit,350px)] gap-4 align-middle justify-center pt-10'>
    {#each peers.items as item}
      <Card.Root class='w-[350px]'>
        <Card.Header class='pb-1'>
          <Card.Title>{item.metadata.name.replace('-', ' ')}</Card.Title>
          <Card.Description class='text-wrap break-words text-primary'>{item.spec.publicKey}</Card.Description>
        </Card.Header>
        <Card.Content class='pb-0 text-gray-400'>
          <div>Joined {new Date(item.metadata.creationTimestamp).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}</div>
          <div class='capitalize'>{item.spec.accessRules.join(', ')}</div>
        </Card.Content>
        <Card.Footer class='flex'>
          <Button class='ml-auto' variant='destructive' on:click={() => deleteObject(item.metadata.name)}>Delete</Button>
        </Card.Footer>
      </Card.Root>
    {/each}
  </div>
</div>
