# Atomic-Argu

- Built with `@tomic/svelte` + `sveltekit`
- Community / project websites
- Content can be easily managed using the Atomic-Server CMS
- Includes import scripts to convert Argu.co JSON exports to JSON-AD
- Look & feel similar based on the Argu.co community platform

## Example sites:

- [argu.nl](https://argu.nl)
- [argu.co](https://argu.co)
- [denkmee.drechtstedenenergie.nl](https://denkmee.drechtstedenenergie.nl)
- [edamvolendam](https://edamvolendam.netlify.app/)
- See [siteconfigs.ts](./src/lib/siteconfigs.ts) for more

## Architecture & multi-page deploy

This repository is used for creating a bunch of different websites.
Each of these websites uses data that is hosted on Atomic-Server.

## Launching a website and managing content

- Create a new drive on Atomic Server.
  - Create a new [`Argu Site`](https://atomicdata.dev/Folder/wp8ame4nqf/MYJkFKGEKz). This serves as an entrypoint.
  - make sure the site is publicly available: context menu, share, public, save.
- When migrating from Argu
  - Download an export using Argu's export feature
  - Unzip and save to `.src/lib/data-{name}`
  - Open the ASA (Atomic Svelte Argu) app locally, you'll see an import button
  - Create a new Drive on Atomic Server, paste it to a new config in `siteConigs.ts`, use the `drive` url as root
  - Run this repo `pnpm dev` and visit `localhost`
  - Press the import button. Magic happens. Checkt the console for errors. If you encounter CORS stuff, install a browser extension that allows you to bypass CORS.
  - You might need to restart the local front-end `pnpm dev`
- Managing content
  - Invite people to edit the drives
  - Instruct how to add `Article` (Article Collection?)

## Data

The `./data-export` folder contains an export containing the current content.
It may be useful during development to use as a data source.
Probably beats copy-pasting.

## Dev info

### Developing

```bash
pnpm i
pnpm dev
```

### Test prerender

Set `origin` in `svelte.config` to `localhost`

### Building static pages

```bash
pnpm build
```

### Deploy using Github Pages

```bash
# This works only for ONE domain at the moment: wonenatthepark.nl.
# See https://github.com/ontola/wonenatthepark/issues/4
pnpm deploy
```

### Deploy using Netlify

- Install netlify cli `pnpm install netlify-cli -g`
- Authenticate `netlify login`
- Run locally, test `netlify dev`
- Create site `netlify unlink && netlify sites:create`
- Deploy `netlify deploy --build -s <site-name>`
