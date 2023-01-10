<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	export let title: string;
	export let markdown = '';
</script>

<article>
	<h1>
		{title}
	</h1>

	<div class="divider" />
	<Markdown md={markdown} />
</article>

<style>
	@import 'open-props/media';

	h1 {
		font-size: var(--font-size-fluid-2);
		margin-bottom: 1rem;
		color: var(--t-text-heading);
	}
	@media (--sm-n-below) {
		h1 {
			font-size: 1.8rem;
		}
	}
	.divider {
		border-bottom: 1px solid var(--gray-3);
		margin-bottom: 1.5rem;
	}
	article :global(p) {
		margin-bottom: 1rem;
		/* max-width: 90ch; */
	}

	article :global(a) {
		color: var(--blue-9);
	}

	article :global(a:hover),
	article :global(a:focus) {
		text-decoration: underline;
	}

	article :global(img) {
		border-radius: var(--t-radius);
		margin-bottom: 1rem;
		box-shadow: var(--shadow-2);
	}
</style>
