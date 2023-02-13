import { get } from 'svelte/store';
import { initStore, store as atomicStore } from '@tomic/svelte';
import { Store } from '@tomic/lib';

const init = () => {
	const atomicStore = new Store();
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
