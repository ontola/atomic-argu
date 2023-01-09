import { PUBLIC_RESOURCE_PARENT } from '$env/static/public';
import { error } from '@sveltejs/kit';
import { Store } from '@tomic/lib';
import { getResource, initStore, store as atomicStore } from '@tomic/svelte';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

const init = () => {
	const serverStore = new Store();
	initStore(serverStore);
};
export const load = (async ({ params }) => {
	let store = get(atomicStore);

	if (store === undefined) {
		console.log('store is undefined');
		init();
		store = get(atomicStore);
	}
	const subject = `${PUBLIC_RESOURCE_PARENT}/${params.path}`;
	const r = await store.getResourceAsync(subject);

	if (r.error) {
		throw error(500, r.error.message);
	}

	const resource = getResource(subject);

	return {
		resource
	};
}) satisfies PageLoad;
