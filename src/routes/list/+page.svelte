<script lang='ts'>
  import { signOut } from '@auth/sveltekit/client'
  import { arr2base, randomBytes } from 'uint8-util'
  import Debug from 'debug'

  import { Button } from '$lib/components/ui/button'
  import { Root, Trigger, Content } from '$lib/components/ui/popover'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import * as Select from '$lib/components/ui/select'
  import * as AlertDialog from '$lib/components/ui/alert-dialog'
  import * as Card from '$lib/components/ui/card'
  import { invalidateAll } from '$app/navigation'
  import generateKeyPair from '@/keys.js'

  const debugAuth = Debug('auth:session')
  const debugK8s = Debug('k8s:client')

  function signout () {
    debugAuth('Requesting sign-out')
    signOut({ callbackUrl: '/' })
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
      if (!/^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/.test(name)) {
        input.setCustomValidity('Must consist of lower case alphanumeric characters, "-" or ".", and must start and end with an alphanumeric character')
        input.reportValidity()
        return
      }

      const { publicKey, privateKey } = generateKeyPair()

      const preSharedKey = arr2base(randomBytes(32))

      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, accessRules: accessRules.map(({ value }) => value), publicKey, preSharedKey })
      })

      if (!res.ok) throw new Error('Failed to create object.\n' + await res.text())

      await invalidateAll()

      debugK8s('Created object. Redirecting')

      open(`/view/${name}#${encodeURIComponent(privateKey)}|${encodeURIComponent(preSharedKey)}`, '_blank')
    } catch (err) {
      debugK8s('Failed to create object %O', err as Error)
    }
  }
  let input: HTMLInputElement
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
        <Input type='text' id='name' placeholder='Name' bind:input bind:value={name} />
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
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild let:builder>
              <Button builders={[builder]} class='ml-auto' variant='destructive'>Delete</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                <AlertDialog.Description>
                  This action cannot be undone. This will permanently delete this profile from our servers.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                <AlertDialog.Action asChild let:builder>
                  <Button builders={[builder]} variant='destructive' on:click={() => deleteObject(item.metadata.name)}>Delete</Button>
                </AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Card.Footer>
      </Card.Root>
    {/each}
  </div>
</div>
