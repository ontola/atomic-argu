# Wonen At The Park

Static page for replacing https://wonenatthepark.nl/

Demo at https://nieuw.wonenatthepark.nl/

## Data

The `./data-export` folder contains an export containing the current content.
It may be useful during development to use as a data source.
Probably beats copy-pasting.

## Developing

```bash
cp template.env .env
npm i
npm run dev
```

## Building

```bash
pnpm build
```

## Deploy

```bash
# Deploys to github pages
pnpm run deploy
```
