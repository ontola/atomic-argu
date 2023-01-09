<script lang="ts">
	import { domain } from '$lib/helpers/domainSubjects';
	import { urls, type Resource } from '@tomic/lib';
	import { getResource, getValue } from '@tomic/svelte';
	import type { Readable } from 'svelte/store';

	export let resource: Readable<Resource>;

	const articleCollectionResource = getValue<string>(resource, domain.articlesCollection);
	const articleCollection = getResource($articleCollectionResource!);

	const articles = getValue<string[]>(articleCollection, urls.properties.collection.members);
</script>

<ul>
	{#each $articles ?? [] as article}
		<li><a href={article ?? '#'}>{article}</a></li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		padding: 0;
	}
</style>
