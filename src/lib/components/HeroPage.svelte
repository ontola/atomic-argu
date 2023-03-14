<script lang="ts">
	import { urls } from '@tomic/lib';
	import { scrollRatio } from '$lib/hooks/scrollRatio';
	import { getResource, getValue } from '@tomic/svelte';
	import Container from './Container.svelte';
	import { writable } from 'svelte/store';

	export let coverSubject: string | undefined = undefined;

	const writeableSubject = writable(coverSubject);
	$: writeableSubject.set(coverSubject);

	$: coverResource = coverSubject ? getResource(writeableSubject) : undefined;
	$: src = coverSubject
		? getValue<string>(coverResource!, urls.properties.file.downloadUrl)
		: undefined;
	$: console.log('inside HeroPage', coverSubject, $coverResource);
</script>

<div class="hero-page-wrapper">
	{#if src && $src}
		<div class="nothing" style={`--image: url(${$src})`}>
			<div class="hero-image" use:scrollRatio={[-0.5, 1]} />
		</div>
	{:else}
		<div class="filler" />
	{/if}
	<Container>
		<div class="title-card">
			<slot name="title-card" />
		</div>
	</Container>
	<div class="content">
		<slot />
	</div>
</div>

<style>
	@import 'open-props/media';

	.nothing {
		display: contents;
	}

	.hero-image {
		--blur: calc((1 - var(--ratio)) * 5px);
		opacity: var(--ratio, 1);
		filter: blur(var(--blur));
		background: var(--image);
		background-size: cover;
		background-position: center;
		transition: opacity 30ms;
		will-change: opacity, filter;
		background-attachment: fixed;
		height: 30rem;
	}

	@media (--md-n-below) {
		.hero-image {
			height: 17rem;
			background-position-y: -10rem;
		}
	}

	.filler {
		height: 30rem;
	}

	.title-card {
		position: relative;
		background-color: var(--t-bg);
		top: -5rem;
		box-shadow: var(--shadow-4);
		border-radius: var(--t-radius);
		width: min(35rem, 100%);
		padding: 1rem;
	}
	.content {
		margin-top: -3rem;
	}
</style>
