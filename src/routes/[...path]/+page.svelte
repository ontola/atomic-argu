<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import ArticleCollection from '$lib/components/ArticleCollection.svelte';
	import HeroArticle from '$lib/components/HeroArticle.svelte';
	import Parent from '$lib/components/Parent.svelte';
	import { domain } from '$lib/helpers/domainSubjects';
	import { urls } from '@tomic/lib';
	import { getValue } from '@tomic/svelte';
	import type { PageData } from './$types';
	import { dev } from '$app/environment';
	export let data: PageData;
	import { onMount } from 'svelte';
	import ArticleWidthConstraint from '$lib/components/ArticleWidthConstraint.svelte';

	onMount(() => {
		document.addEventListener('keydown', (event) => {
			if (dev && event.ctrlKey && event.key === 'e') {
				event.preventDefault();
				// open in new tab
				window.open($resource.getSubject(), '_blank');
			}
		});
	});

	$: ({ resource, childrenCollection } = data);

	$: name = getValue<string>(resource, urls.properties.name);
	$: description = getValue<string>(resource, urls.properties.description);
	$: parent = getValue<string>(resource, urls.properties.parent);
	$: cover = getValue<string>(resource, domain.coverImage);
	$: originalUrl = getValue<string>(resource, 'https://atomicdata.dev/properties/original-url');
</script>

<svelte:head>
	<title>{$name}</title>
	<meta name="description" content={$description?.slice(0, 100) + '...'} />
</svelte:head>
<HeroArticle coverSubject={$cover}>
	<svelte:fragment slot="article">
		<ArticleWidthConstraint>
			<div class="top-links">
				<Parent subject={$parent} />
				{#if dev && $originalUrl}
					<span class="dev-links">
						<a href={$originalUrl}>source</a>
						<a href={$resource.getSubject()}>edit</a>
					</span>
				{/if}
			</div>
		</ArticleWidthConstraint>
		<Article title={$name ?? ''} markdown={$description ?? ''} />
	</svelte:fragment>
	{#if childrenCollection}
		<ArticleCollection subject={childrenCollection} title="Reacties" />
	{:else}
		<p>Er zijn geen onderwerpen gevonden.</p>
	{/if}
</HeroArticle>

<style>
	.top-links {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.top-links a:hover {
		text-decoration: underline;
	}

	.dev-links {
		display: inline-flex;
		gap: 1rem;
	}
</style>
