import { PUBLIC_SITE } from '$env/static/public';
import { domain } from '$lib/helpers/domainSubjects';
import { Store, urls } from '@tomic/lib';
import { getResource, initStore, loadResourceTree, store as storeStore } from '@tomic/svelte';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

const init = () => {
	const serverStore = new Store();
	initStore(serverStore);
};
export const load = (async ({ fetch }) => {
	let store = get(storeStore);

	if (store === undefined) {
		init();
		store = get(storeStore);
	}

	store.injectFetch(fetch);

	await loadResourceTree(PUBLIC_SITE, {
		[domain.pages]: true,
		[domain.coverImage]: true,
		[domain.articlesCollection]: {
			[urls.properties.collection.members]: {
				[domain.coverImage]: true
			}
		}
	});

	const resource = getResource(PUBLIC_SITE);

	return {
		resource
	};
}) satisfies PageLoad;
