<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import ArticleCollection from '$lib/components/ArticleCollection.svelte';
	import HeroArticle from '$lib/components/HeroArticle.svelte';
	import { domain } from '$lib/helpers/domainSubjects';
	import { urls } from '@tomic/lib';
	import { getValue } from '@tomic/svelte';
	import type { PageData } from './$types';
	import { currentSiteConfig } from '$lib/siteConfigs';
	import ArguHome from '$lib/components/ArguHome/ArguHome.svelte';

	export let data: PageData;

	let { resource, childrenCollection } = data;

	const name = getValue<string>(resource, urls.properties.name);
	const description = getValue<string>(resource, urls.properties.description);
	const cover = getValue<string>(resource, domain.coverImage);
	const argu = currentSiteConfig.homePath === 'argu';
</script>

<svelte:head>
	<title>{$name}</title>
	<meta name="description" content={$description} />
</svelte:head>

{#if argu}
	<ArguHome />
{:else}
	<HeroArticle coverSubject={$cover}>
		<svelte:fragment slot="article">
			<Article
				title={$name ?? ''}
				markdown={$description ?? ''}
				constrain={false}
			/>
		</svelte:fragment>

		<ArticleCollection subject={childrenCollection} />
	</HeroArticle>
{/if}
