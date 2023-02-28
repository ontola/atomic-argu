<script lang="ts">
	import ArticleCollection from '$lib/components/ArticleCollection.svelte';
	import Container from '$lib/components/Container.svelte';
	import HeroPage from '$lib/components/HeroPage.svelte';
	import { domain } from '$lib/helpers/domainSubjects';
	import { urls } from '@tomic/lib';
	import { getValue } from '@tomic/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let { resource, childrenCollection } = data;

	const name = getValue<string>(resource, urls.properties.name);
	const description = getValue<string>(resource, urls.properties.description);
	const cover = getValue<string>(resource, domain.coverImage);
</script>

<svelte:head>
	<title>{$name}</title>
	<meta name="description" content={$description} />
</svelte:head>

<HeroPage coverSubject={$cover}>
	<svelte:fragment slot="title-card">
		<h1>{$name}</h1>
		<p class="page-description">{$description}</p>
	</svelte:fragment>

	<Container>
		<h2>Onderwerpen</h2>
		{#if childrenCollection}
			<ArticleCollection subject={childrenCollection} />
		{:else}
			<p>Er zijn geen onderwerpen gevonden.</p>
		{/if}
	</Container>
</HeroPage>

<style>
	h1 {
		color: var(--t-text-heading);
	}
	.page-description {
		margin-bottom: 1rem;
		max-width: 70ch;
	}
</style>
