<script>
  import Debug from 'debug'
  import '../app.pcss'

  export let data

  Debug.enable(data.debug)
</script>

<slot />
