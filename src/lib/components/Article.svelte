<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	export let title: string;
	export let markdown = '';
</script>

<article>
	<h1>
		{title}
	</h1>

	<Markdown md={markdown} />
</article>

<style>
	.article :global(p) {
		margin-bottom: 1rem;
		max-width: 70ch;
		color: red;
	}
</style>
