import { PUBLIC_SITE } from '$env/static/public';
import { Store } from '@tomic/lib';
import { getResource, initStore, store as storeStore } from '@tomic/svelte';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

const init = () => {
	const serverStore = new Store();
	initStore(serverStore);
};
export const load = (async () => {
	let store = get(storeStore);

	if (store === undefined) {
		init();
		store = get(storeStore);
	}
	const resource = getResource(PUBLIC_SITE);

	return {
		resource
	};
}) satisfies PageLoad;
