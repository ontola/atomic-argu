<script lang="ts">
	import ArticleCollection from '$lib/components/ArticleCollection.svelte';
	import Container from '$lib/components/Container.svelte';
	import HeroPage from '$lib/components/HeroPage.svelte';
	import { urls } from '@tomic/lib';
	import { getValue } from '@tomic/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let { resource } = data;

	const name = getValue(resource, urls.properties.name);
	const description = getValue(resource, urls.properties.description);
</script>

<svelte:head>
	<title>{$name}</title>
</svelte:head>
<HeroPage src="/home_hero.jpeg">
	<svelte:fragment slot="title-card">
		<h1>{$name}</h1>
		<p>{$description}</p>
	</svelte:fragment>

	<Container>
		<ArticleCollection {resource} />
	</Container>
</HeroPage>

<style>
	p {
		margin-bottom: 1rem;
		max-width: 70ch;
	}
</style>
