<script lang="ts">
	export let href: string;
	export let type: 'text' | 'image' = 'text';
</script>

<a {href} class:image={type === 'image'}>
	<slot />
</a>

<style>
	a {
		color: var(--t-color-main-text);
		text-decoration: none;
		display: flex;
		align-items: center;
		height: var(--header-height);
		padding-inline: 0.5rem;
	}

	a.image {
		padding-inline: 0;
	}

	a:focus,
	a:hover {
		color: var(--t-color-main-text);
		text-decoration: underline;
		filter: brightness(0.9);
		background-color: var(--t-color-main);
	}
</style>
