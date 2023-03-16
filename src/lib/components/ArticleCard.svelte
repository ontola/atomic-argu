<script lang="ts">
	import { constructArticleUrl } from '$lib/helpers/constructArticleUrl';
	import { urls } from '@tomic/lib';
	import Markdown from 'svelte-exmarkdown';
	import { getResource, getValue } from '@tomic/svelte';
	import { domain } from '$lib/helpers/domainSubjects';

	export let subject: string;

	$: resource = getResource(subject);
	$: name = getValue<string>(resource, urls.properties.name);
	$: description = getValue<string>(resource, urls.properties.description);

	$: cover = getValue<string>(resource, domain.coverImage);
	$: coverResource = $cover ? getResource($cover) : undefined;
	$: coverSrc = $cover
		? getValue<string>(coverResource!, urls.properties.file.downloadUrl)
		: undefined;

	$: trimmedDescription = `${$description?.slice(0, 200)}${
		($description?.length ?? 0) > 200 ? '...' : ''
	}`;
</script>

<a class="card" href={constructArticleUrl(subject)}>
	{#if $coverSrc}
		<div class="image" style={coverSrc ? `background-image: url(${$coverSrc})` : ''} />
	{/if}
	<div class="inner">
		<h3>{$name}</h3>
		{#if !$coverSrc}
			<Markdown md={trimmedDescription} />
		{/if}
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background-color: var(--t-bg);
		border-radius: var(--t-radius);
		height: 12rem;
		transition: transform 300ms var(--ease-squish-1), box-shadow 100ms ease-in-out;
		/* Prevent border radius on images */
		overflow: hidden;
	}
	.card:hover,
	.card:focus {
		box-shadow: 0 0 0 2px var(--t-color-main);
		outline: none;
		transform: scale(1.05);
	}

	.inner {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		overflow: hidden;
	}

	.image {
		background-size: cover;
		background-position: center;
		display: flex;
		flex: 1;
	}

	h3 {
		font-size: 1.2rem;
		color: var(--t-text-heading);
	}

	.card :global(p) {
		font-size: 0.9rem;
	}
	.card :global(h2) {
		font-size: 1.2rem;
	}
</style>
