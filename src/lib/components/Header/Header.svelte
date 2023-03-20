<script lang="ts">
	import { dev } from '$app/environment';
	import { domain } from '$lib/helpers/domainSubjects';
	import { currentSiteConfig } from '$lib/siteConfigs';
	import { properties } from '@tomic/lib/dist/src/urls';
	import { getResource, getValue } from '@tomic/svelte';
	import Container from '../Container.svelte';
	import Searchbar from '../Search/Searchbar.svelte';
	import NavLink from './NavLink.svelte';
	import ResourceNavLink from './ResourceNavLink.svelte';

	$: page = getResource(currentSiteConfig.atomicSite);
	$: pages = getValue<string[]>(page, domain.pages);
	$: image = getValue<string>(page, domain.siteImage);
	$: name = getValue<string>(page, properties.name);

	let onImportClick = () => {
		console.error("'Import.ts' not imported");
	};

	if (dev) {
		import('$lib/import').then(({ importFiles }) => {
			onImportClick = importFiles;
		});
	}
</script>

<header>
	<Container>
		<nav>
			<ul>
				<li>
					<NavLink href="/" type="image" title="Homepagina">
						{#if $image}
							<img src={$image} alt={`${$name} logo`} class="logo" />
						{:else}
							{$name}
						{/if}
					</NavLink>
				</li>
				{#each $pages ?? [] as page}
					<li>
						<ResourceNavLink subject={page} />
					</li>
				{/each}
				{#if dev}
					<li>
						<button on:click={onImportClick}>import</button>
					</li>
				{/if}
				<span class="search-wrapper">
					<Searchbar />
				</span>
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

	.search-wrapper {
		margin-left: auto;
	}
</style>
