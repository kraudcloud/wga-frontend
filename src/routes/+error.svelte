<script lang='ts'>
  // copy of svelte's built-in error page
  import { page } from '$app/stores'

  const error = $page.error!
  const status = $page.status
</script>

<svelte:head>
  <title>{error.message}</title>
</svelte:head>

<div class='parent'>
  <div class='error'>
    <span class='status'>{status}</span>
    <div class='message'>
      <h1>{error.message}</h1>
    </div>
  </div>
</div>

<style>
  .parent {
    --bg: white;
    --fg: #222;
    --divider: #ccc;
    background: var(--bg);
    color: var(--fg);
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      'Open Sans',
      'Helvetica Neue',
      sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
  }

  .error {
    display: flex;
    align-items: center;
    max-width: 32rem;
    margin: 0 1rem;
  }

  .status {
    font-weight: 200;
    font-size: 3rem;
    line-height: 1;
    position: relative;
    top: -0.05rem;
  }

  .message {
    border-left: 1px solid var(--divider);
    padding: 0 0 0 1rem;
    margin: 0 0 0 1rem;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
  }

  .message h1 {
    font-weight: 400;
    font-size: 1em;
    margin: 0;
  }

  @media (prefers-color-scheme: dark) {
    .parent {
      --bg: #222;
      --fg: #ddd;
      --divider: #666;
    }
  }
</style>
