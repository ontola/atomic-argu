<script lang="ts">
	import { dev } from '$app/environment';
	import { PUBLIC_SITE } from '$env/static/public';
	import { domain } from '$lib/helpers/domainSubjects';
	import { importFiles } from '$lib/import';
	import { getResource, getValue } from '@tomic/svelte';
	import Container from '../Container.svelte';
	import NavLink from './NavLink.svelte';
	import ResourceNavLink from './ResourceNavLink.svelte';

	const page = getResource(PUBLIC_SITE);
	const pages = getValue<string[]>(page, domain.pages);
</script>

<header>
	<Container>
		<nav>
			<ul>
				<li>
					<NavLink href="/" type="image" title="Homepagina">
						<img src="/watp_logo.png" alt="Wonen at the park logo" class="logo" />
					</NavLink>
				</li>
				{#each $pages ?? [] as page}
					<li>
						<ResourceNavLink subject={page} />
					</li>
				{/each}
				{#if dev}
					<button on:click={importFiles}>run import</button>
				{/if}
			</ul>
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

	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 0;
	}
</style>
