<script lang="ts" context="module">
	export const NO_RESULTS = 'NO_RESULTS';
</script>

<script lang="ts">
	import { debounced } from '$lib/helpers/debounced';

	import { currentSiteConfig } from '$lib/siteConfigs';

	import { buildSearchSubject, urls } from '@tomic/lib';
	import { getResource, getValue, store } from '@tomic/svelte';

	import { resetSearch, searchResultList, searchValue } from './search';
	import SearchIcon from './SearchIcon.svelte';

	let debouncedValue = debounced(searchValue, 200);

	$: searchSubject = buildSearchSubject($store, $debouncedValue, {
		scope: currentSiteConfig.parentRoot
	});

	$: resource = getResource(searchSubject, { noWebSocket: true });
	$: results = getValue<string[]>(resource, urls.properties.endpoint.results);

	$: if ($debouncedValue === '') {
		resetSearch();
	} else {
		if (!$resource.loading) {
			$searchResultList = $results ?? [NO_RESULTS];
		}
	}

	$: console.log('search results', $searchResultList);
</script>

<div class="input-wrapper">
	<SearchIcon />
	<input type="search" bind:value={$searchValue} placeholder="Zoeken..." />
</div>

<style>
	.input-wrapper {
		border-radius: 5rem;
		border: none;
		padding: var(--size-1);
		padding-inline-start: var(--size-3);
		background-color: var(--t-color-main-light);
		color: white;
		display: flex;
		align-items: center;
		gap: 1ch;
	}

	.input-wrapper:focus-within {
		box-shadow: 0 0 0 0.1rem white;
	}

	input {
		border: none;
		background-color: transparent;
		color: white;
	}

	input::placeholder {
		color: white;
		opacity: 0.9;
	}

	input:focus {
		outline: none;
	}
</style>
