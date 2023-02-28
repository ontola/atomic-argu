<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: style = `--t-color-main: ${data.color || 'rgb(30,30,30)'}`;
</script>

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
