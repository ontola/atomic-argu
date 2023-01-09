<script lang="ts">
	import { importFiles } from '$lib/import';
	import Container from './Container.svelte';
</script>

<header>
	<Container>
		<nav>
			<a href="/">
				<img src="/watp_logo.png" alt="" class="logo" />
			</a>
			<button on:click={importFiles}>import</button>
		</nav>
	</Container>
</header>

<style>
	header {
		--header-height: 3rem;
		background-color: var(--t-color-main);
		color: var(--t-color-main-text);
		height: var(--header-height);
		position: fixed;
		width: 100%;
		z-index: 100;
		box-shadow: var(--shadow-3);
	}

	.logo {
		height: var(--header-height);
		width: auto;
	}
</style>
