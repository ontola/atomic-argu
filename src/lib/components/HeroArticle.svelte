<script lang="ts">
	import { scrollRatio } from '$lib/hooks/scrollRatio';
	import { urls } from '@tomic/lib';
	import { getResource, getValue } from '@tomic/svelte';
	import Container from './Container.svelte';

	export let coverSubject: string | undefined;

	$: coverResource = coverSubject ? getResource(coverSubject) : undefined;
	$: src = coverSubject
		? getValue<string>(coverResource!, urls.properties.file.downloadUrl)
		: undefined;
</script>

<div>
	{#if src && $src}
		<div class="nothing" style={`--image: url(${$src})`}>
			<div class="hero-image" use:scrollRatio={[-0.5, 1]} />
		</div>
	{:else}
		<div class="filler" />
	{/if}
	<Container>
		<div class="article">
			<slot name="article" />
		</div>
	</Container>
	<div class="content">
		<slot />
	</div>
</div>

<style>
	@import 'open-props/media';

	.hero-image {
		--blur: calc((1 - var(--ratio)) * 5px);
		opacity: var(--ratio, 1);
		filter: blur(var(--blur));
		background: var(--image);
		background-size: cover;
		background-position: center;
		transition: opacity 30ms;
		will-change: opacity filter;
		background-attachment: fixed;
		/* background-repeat: no-repeat; */
		height: 30rem;
	}

	@media (--md-n-below) {
		.hero-image {
			height: 17rem;
			background-position-y: -10rem;
		}
	}

	.nothing {
		display: contents;
	}
	.filler {
		height: 10rem;
	}
	.article {
		position: relative;
		background-color: var(--t-bg);
		top: -5rem;
		box-shadow: var(--shadow-4);
		border-radius: var(--t-radius);
		width: 100%;
		padding: 1rem;
	}
	.content {
		margin-top: -3rem;
	}
</style>
