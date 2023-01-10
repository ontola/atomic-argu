<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import HeroArticle from '$lib/components/HeroArticle.svelte';
	import { domain } from '$lib/helpers/domainSubjects';
	import { urls } from '@tomic/lib';
	import { getValue } from '@tomic/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let resource = data.resource;

	const name = getValue<string>(resource, urls.properties.name);
	const description = getValue<string>(resource, urls.properties.description);
	const cover = getValue<string>(resource, domain.coverImage);
</script>

<HeroArticle coverSubject={$cover}>
	<svelte:fragment slot="article">
		<Article title={$name ?? ''} markdown={$description ?? ''} />
	</svelte:fragment>
</HeroArticle>

<style>
	p {
		margin-bottom: 1rem;
		max-width: 70ch;
	}
</style>
