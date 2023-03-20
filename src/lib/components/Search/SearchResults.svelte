<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import ArticleCard from '../ArticleCard.svelte';
	import Container from '../Container.svelte';
	import { NO_RESULTS } from './Searchbar.svelte';
	import { resetSearch, searchResultList } from './search';

	let unsubscribe: () => void = () => undefined;

	const onKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			resetSearch();
		}
	};

	onMount(() => {
		const unsubStore = searchResultList.subscribe((results) => {
			if (results.length > 0) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		});

		document.addEventListener('keydown', onKeyPress);

		unsubscribe = () => {
			unsubStore();
			document.removeEventListener('keydown', onKeyPress);
		};
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if $searchResultList.length > 0}
	<section aria-label="Search Results" class="wrapper" transition:fly={{ y: 1000, duration: 200 }}>
		<div class="scroll-container">
			<Container>
				<h2>Resultaten</h2>
				<ol class="list">
					{#each $searchResultList as result}
						{#if result === NO_RESULTS}
							<span>Geen Resultaten</span>
						{:else}
							<li>
								<ArticleCard subject={result} on:click={() => resetSearch()} />
							</li>
						{/if}
					{/each}
				</ol>
			</Container>
		</div>
	</section>
{/if}

<style>
	h2 {
		position: sticky;
	}
	.wrapper {
		position: fixed;
		background-color: var(--t-bg-body);
		left: var(--size-3);
		right: var(--size-3);
		bottom: 0;
		top: 10rem;
		height: calc(100vh - 10rem);
		padding: var(--size-6);
		box-shadow: var(--shadow-6);
		border-top-right-radius: var(--radius-4);
		border-top-left-radius: var(--radius-4);
	}

	.scroll-container {
		overflow: auto;
		height: 100%;
	}
	.list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		gap: var(--size-3);
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		margin: 0;
		padding: 0;
	}
</style>
