<script lang="ts">
	import { urls } from '@tomic/lib';
	import { getResource, getValue } from '@tomic/svelte';
	import ArticleCard from './ArticleCard.svelte';
	import Container from './Container.svelte';

	export let subject: string;
	export let title: string = '';
	$: resource = getResource(subject);
	$: articles = getValue<string[]>(resource, urls.properties.collection.members);
</script>

<Container>
	{#if $articles && $articles.length > 0}
		<h2>{title}</h2>
	{/if}

	{#if $resource.loading}
		<p>Loading...</p>
	{:else}
		<ul>
			{#each $articles ?? [] as article (article)}
				<li>
					<ArticleCard subject={article} />
				</li>
			{/each}
		</ul>
	{/if}
</Container>

<style>
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
		list-style: none;
		padding: 0;
	}
</style>
