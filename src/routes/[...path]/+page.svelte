<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import ArticleCollection from '$lib/components/ArticleCollection.svelte';
	import HeroArticle from '$lib/components/HeroArticle.svelte';
	import Parent from '$lib/components/Parent.svelte';
	import { domain } from '$lib/helpers/domainSubjects';
	import { core, server, urls } from '@tomic/lib';
	import { getValue } from '@tomic/svelte';
	import type { PageData } from './$types';
	import { dev } from '$app/environment';
	export let data: PageData;
	import { onMount } from 'svelte';
	import ArticleWidthConstraint from '$lib/components/ArticleWidthConstraint.svelte';
	import Attachment from '$lib/components/Attachment.svelte';
	import type { Writable } from 'svelte/store';

	function handleKeydown(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === 'e') {
			event.preventDefault();
			// open in new tab
			window.open($resource.getSubject(), '_blank');
		}
	}

	onMount(() => {
		document.addEventListener('keydown', event => {});
	});

	$: ({ resource, childrenCollection } = data);

	$: name = getValue(resource, core.properties.name);
	$: description = getValue(resource, core.properties.description);
	$: parent = getValue(resource, core.properties.parent);
	$: cover = getValue(resource, domain.coverImage) as Writable<string>;
	$: originalUrl = getValue<string>(
		resource,
		'https://atomicdata.dev/properties/original-url',
	) as Writable<string>;
	$: attachments = getValue(resource, server.properties.attachments);
	$: publishedAt = getValue(
		resource,
		'https://atomicdata.dev/properties/published-at',
	) as Writable<string>;

	$: dateString = $publishedAt && new Date($publishedAt).toLocaleDateString();
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
	<title>{$name}</title>
	<meta name="description" content={$description?.slice(0, 100) + '...'} />
</svelte:head>
<HeroArticle coverSubject={$cover}>
	<svelte:fragment slot="article">
		<ArticleWidthConstraint>
			<div class="top-links">
				<Parent subject={$parent} />
				<span class="dev-links">
					{#if dateString}
						<span>geplaatst op {dateString}</span>
					{/if}
					{#if dev && $originalUrl}
						<a href={$originalUrl}>source</a>
						<a href={$resource.getSubject()}>edit</a>
					{/if}
				</span>
			</div>
		</ArticleWidthConstraint>
		<Article title={$name ?? ''} markdown={$description ?? ''} />
		{#if $attachments}
			<ArticleWidthConstraint>
				<div class="attachments">
					{#each $attachments ?? [] as attachment (attachment)}
						<Attachment subject={attachment} />
					{/each}
				</div>
			</ArticleWidthConstraint>
		{/if}
	</svelte:fragment>
	{#if childrenCollection}
		<ArticleCollection subject={childrenCollection} />
	{:else}
		<p>Er zijn geen onderwerpen gevonden.</p>
	{/if}
</HeroArticle>

<style>
	.attachments {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.top-links {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-left: calc(var(--size-2) * -1);
	}

	.dev-links > * {
		color: var(--gray-6);
		padding: var(--size-2);
	}

	.top-links a:hover {
		text-decoration: underline;
	}

	.dev-links {
		display: inline-flex;
	}
</style>
