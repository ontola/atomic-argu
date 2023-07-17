<script lang="ts">
	import { useVisible } from '$lib/hooks/useVisible';
	export let title: string;
	export let videoId: string | undefined = undefined;
	export let imageId: string | undefined = undefined;
	let visible = false;
</script>

<div
	class="block"
	class:fade-in={visible}
	use:useVisible={{
		onVisibleChange: v => {
			if (v) {
				visible = v;
			}
		},
	}}
>
	<div class="text">
		<h2>{title}</h2>
		<p>
			<slot />
		</p>
	</div>
	{#if imageId}
		<img src={`/arguhome/${imageId}`} alt={title} />
	{/if}
	{#if videoId}
		<video autoplay loop playsinline muted>
			<source src={`/arguhome/${videoId}.mp4`} type="video/mp4" />
		</video>
	{/if}
</div>

<style>
	.block {
		width: min(var(--t-containing-width-large), 100%);
		margin: auto;
		margin-bottom: 10rem;
		display: grid;
		/* use grid to invert the image / text blocks */
		grid-template-rows: 1fr;
		grid-template-areas: 'text image';
		/* on mobile show beneath */
		grid-template-columns: 1fr;
		display: flex;
		gap: 2rem;
		flex-direction: column;
		opacity: 0;
		--animation-size: 20px;
	}
	.text {
		display: flex;
		flex-direction: column;
		justify-content: center;
		grid-area: text;
	}
	/* does not work in svelte! Use global selector */
	/* .text > a {
		color: var(--color-primary);
		text-decoration: underline;
	} */
	/* global: */
	.text :global(a) {
		color: var(--color-primary);
		text-decoration: underline;
	}

	p {
		font-size: var(--font-size-fluid-1);
	}
	img,
	video {
		border-radius: 10px;
		box-shadow: var(--shadow-5);
		grid-area: image;
		width: 100%;
	}
	h2 {
		font-size: var(--font-size-fluid-2);
		font-weight: 800;
		margin: 0;
		line-height: 1.2;
	}
	/* on large screens zigzag the blocks */
	@media (min-width: 800px) {
		.block {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
		.block:nth-child(odd) {
			grid-template-areas: 'image text';
		}
	}

	.fade-in {
		--offset: var(--animation-size);
		animation: fade-in 0.5s ease-in-out forwards;
	}

	.fade-in:nth-child(odd) {
		--offset: calc(var(--animation-size) * -1);
	}

	/* no motion for prefers stuff */
	@media (prefers-reduced-motion: reduce) {
		.fade-in {
			--offset: 0;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateX(var(--offset));
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
