# Atomic-Svelte-Argu

- Community / project websites
- Content can be easily managed using the Atomic-Server CMS
- Includes import scripts to conver Argu JSON exports to JSON-AD
- Look & feel similar based on the Argu.co community platform

## Architecture & multi-page deploy

This repository is used for creating a bunch of different websites.
Each of these websites uses data that is hosted on Atomic-Server.

## Launching a website and managing content

- Create a new drive on Atomic Server.
  - Create a new [`Argu Site`](https://atomicdata.dev/Folder/wp8ame4nqf/MYJkFKGEKz). This serves as an entrypoint.
  - make sure the site is publicly available
- When migrating from Argu
  - Download an export using Argu's export feature
  - Unzip and save to `.src/lib/data-{name}`
  - Open the ASA (Atomic Svelte Argu) app locally, you'll see an import button
  - Create a `./src/lib/siteConfigs.ts` for the new site
  - Run this repo `pnpm dev` and visit `localhost`
  - Press the import button. Now the JSON-AD will be copied to your clipboard
  - Paste the JSON-AD into the importer mentioned above
- Managing content
  - Invite people to edit the drives
  - Instruct how to add `Article` (Article Collection?)

## List of Sites

- https://atomicdata.dev/wonenatthepark/site
- https://atomicdata.dev/edamvolendam/site

## Data

The `./data-export` folder contains an export containing the current content.
It may be useful during development to use as a data source.
Probably beats copy-pasting.

## Dev info

### Developing

```bash
cp template.env .env
pnpm i
pnpm dev
```

### Test prerender

Set `origin` in `svelte.config` to `localhost`

### Building static pages

```bash
pnpm build
```

### Deploy

```bash
# This works only for ONE domain at the moment: wonenatthepark.nl.
# See https://github.com/ontola/wonenatthepark/issues/4
pnpm deploy
```
