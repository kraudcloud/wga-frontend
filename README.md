## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

## Publishing

To publish run:

```bash
node -r dotenv/config build
```

Required env variables:

- AUTHENTIK_ID
- AUTHENTIK_SECRET
- AUTH_SECRET - random base64 encoded key
- AUTHENTIK_DOMAIN - domain for authentic endpoint `https://my.domain/`
- ORIGIN - domain which runs your app `https://my-public.domain/`
- DEBUG - debug levels [optional]


