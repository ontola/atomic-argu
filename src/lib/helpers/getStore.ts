import { get } from 'svelte/store';
import { initStore, store as atomicStore } from '@tomic/svelte';
import { Store } from '@tomic/lib';
import { currentSiteConfig } from '$lib/siteConfigs';

const init = () => {
	const atomicStore = new Store({
		serverUrl: currentSiteConfig.serverUrl
	});
	initStore(atomicStore);
};

export const getStore = () => {
	let store = get(atomicStore);

	if (store === undefined) {
		init();
		store = get(atomicStore);
	}

	return store;
};
