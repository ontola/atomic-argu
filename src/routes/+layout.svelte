<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import { cssProps } from '$lib/helpers/cssprops';
	import { currentSiteConfig } from '$lib/siteConfigs';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: style = cssProps({
		't-color-main': (data.color as string) || 'rgb(30,30,30)',
		...(currentSiteConfig.customFont
			? {
					't-font-family-heading': currentSiteConfig.customFont.fontFamily
			  }
			: {})
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
	<main>
		<slot />
	</main>
</div>

<style>
	@import url('$lib/reset.css');
	@import url('$lib/theme.css');

	.wrapper {
		display: contents;
	}
</style>
