<script lang="ts">
	import { constructArticleUrl } from '$lib/helpers/constructArticleUrl';
	import { urls } from '@tomic/lib';
	import Markdown from 'svelte-exmarkdown';
	import { getResource, getValue } from '@tomic/svelte';

	export let subject: string;

	$: resource = getResource(subject);
	$: name = getValue<string>(resource, urls.properties.name);
	$: description = getValue<string>(resource, urls.properties.description);

	$: trimmedDescription = `${$description?.slice(0, 200)}${
		($description?.length ?? 0) > 200 ? '...' : ''
	}`;
</script>

<a class="card" href={constructArticleUrl(subject)}>
	<h3>{$name}</h3>
	<Markdown md={trimmedDescription} />
</a>

<style>
	.card {
		display: block;
		background-color: var(--t-bg);
		border-radius: var(--t-radius);
		padding: 1rem;
		height: 100%;
		transition: transform 300ms var(--ease-squish-1), box-shadow 100ms ease-in-out;
	}

	.card:hover,
	.card:focus {
		box-shadow: inset 0 0 0 2px var(--t-color-main);
		outline: none;
		transform: scale(1.05);
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
