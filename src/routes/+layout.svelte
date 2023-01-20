<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
</script>

<Header />
<main>
	<slot />
</main>

<style>
	@import url('$lib/reset.css');
	@import url('$lib/theme.css');
</style>
