<script lang="ts">
	import { setLightness } from 'polished';
	import Header from '$lib/components/Header/Header.svelte';
	import { resetSearch, searchResultList } from '$lib/components/Search/search';
	import SearchResults from '$lib/components/Search/SearchResults.svelte';
	import { cssProps } from '$lib/helpers/cssprops';
	import { currentSiteConfig } from '$lib/siteConfigs';
	import type { LayoutData } from './$types';
	import Backdrop from '$lib/components/Backdrop.svelte';
	export let data: LayoutData;

	$: style = cssProps({
		't-color-main': (data.color as string) || 'rgb(30,30,30)',
		't-color-main-light': setLightness(0.55, data.color as string),
		't-font-family-heading': currentSiteConfig.customFont?.fontFamily,
		't-text': currentSiteConfig.bodyTextColor,
		't-text-heading': currentSiteConfig.headingTextColor,
	});
</script>

<svelte:head>
	{#if currentSiteConfig.customFont}
		{#each currentSiteConfig.customFont.links as font}
			<link
				href={font.href}
				crossorigin={font.crossorigin ? 'anonymous' : null}
				rel={font.rel ? font.rel : null}
			/>
		{/each}
	{/if}
</svelte:head>
<div class="wrapper" {style}>
	<Header />
	<main inert={$searchResultList.length > 0 || undefined}>
		<slot />
	</main>
	{#if $searchResultList.length > 0}
		<Backdrop on:click={() => resetSearch()} />
	{/if}
	<SearchResults />
</div>

<style>
	@import url('$lib/reset.css');
	@import url('$lib/theme.css');

	.wrapper {
		color: var(--t-text);
	}
</style>
