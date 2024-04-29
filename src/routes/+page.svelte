<script lang='ts'>
  import { signIn } from '@auth/sveltekit/client'
  import Debug from 'debug'

  const debug = Debug('auth:session')

  debug('Requesting sign-in')

  signIn()
</script>
