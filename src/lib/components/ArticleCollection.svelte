<script lang="ts">
	import { urls } from '@tomic/lib';
	import { getResource, getValue } from '@tomic/svelte';
	import ArticleCard from './ArticleCard.svelte';

	export let subject: string;

	let resource = getResource(subject);

	const articles = getValue<string[]>(resource, urls.properties.collection.members);
</script>

{#if $resource.loading}
	<p>Loading...</p>
{:else}
	<ul>
		{#each $articles ?? [] as article}
			<li>
				<ArticleCard subject={article} />
			</li>
		{/each}
	</ul>
{/if}

<style>
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
		list-style: none;
		padding: 0;
	}
</style>
