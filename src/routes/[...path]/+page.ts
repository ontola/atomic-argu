import { PUBLIC_RESOURCE_PARENT } from '$env/static/public';
import { domain } from '$lib/helpers/domainSubjects';
import { error } from '@sveltejs/kit';
import { Store } from '@tomic/lib';
import { getResource, initStore, loadResourceTree, store as atomicStore } from '@tomic/svelte';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

const init = () => {
	const serverStore = new Store();
	initStore(serverStore);
};
export const load = (async ({ params, fetch }) => {
	let store = get(atomicStore);

	if (store === undefined) {
		console.log('store is undefined');
		init();
		store = get(atomicStore);
	}

	store.injectFetch(fetch);

	const subject = `${PUBLIC_RESOURCE_PARENT}/${params.path}`;
	const r = await store.getResourceAsync(subject);

	await loadResourceTree(subject, {
		[domain.coverImage]: true
	});

	if (r.error) {
		throw error(500, r.error.message);
	}

	return {
		resource: getResource(subject)
	};
}) satisfies PageLoad;
