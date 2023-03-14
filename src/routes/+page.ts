import { currentSiteConfig } from '$lib/siteConfigs';
import { domain } from '$lib/helpers/domainSubjects';
import { getStore } from '$lib/helpers/getStore';
import { urls } from '@tomic/lib';
import { getResource, loadResourceTree } from '@tomic/svelte';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const store = getStore();

	store.injectFetch(fetch);

	const subject = currentSiteConfig.atomicSite;

	await loadResourceTree(subject, {
		[domain.pages]: true,
		[domain.coverImage]: true,
		[domain.articlesCollection]: {
			[urls.properties.collection.members]: {
				[domain.coverImage]: true
			}
		}
	});

	// We create a collection that contains all children of the current Subject
	const generatedCollectionURL = new URL(subject);
	generatedCollectionURL.pathname = '/collections';
	// generatedCollectionURL.searchParams.set(
	// 	'sort_by',
	// 	'https://atomicdata.dev/properties/published-at'
	// );
	generatedCollectionURL.searchParams.set('property', urls.properties.parent);
	generatedCollectionURL.searchParams.set('value', subject);

	const childrenCollection = generatedCollectionURL.toString();
	console.log('childrenCollection', childrenCollection);

	await loadResourceTree(childrenCollection, {
		[urls.properties.collection.members]: true
	});

	const resource = getResource(subject);

	return {
		resource,
		childrenCollection
	};
}) satisfies PageLoad;
