<script lang="ts">
	import { constructArticleUrl } from '$lib/helpers/constructArticleUrl';
	import { currentSiteConfig } from '$lib/siteConfigs';
	import { urls } from '@tomic/lib';
	import { getResource, getValue } from '@tomic/svelte';
	import Icon from './ParentIcon.svelte';

	export let subject: string = currentSiteConfig.atomicSite;

	$: resource = getResource(subject);
	$: title = getValue<string[]>(resource, urls.properties.name);
</script>

<a href={constructArticleUrl(subject)}>
	<Icon />
	{#if $resource.loading}
		Loading...
	{:else}
		{$title}
	{/if}
</a>

<style>
	a {
		opacity: 0.7;
		display: flex;
		align-items: center;
		color: var(--t-text-heading);
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
		opacity: 1;
	}
	a > :global(svg) {
		fill: var(--t-text-heading);
		margin-right: 0.5rem;
	}
</style>
