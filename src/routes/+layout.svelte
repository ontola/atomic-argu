<script lang="ts">
	import '$lib/reset.css';
	import '$lib/theme.css';
	import Header from '$lib/components/Header/Header.svelte';
</script>

<Header />
<main>
	<slot />
</main>
