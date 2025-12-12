import { properties, type Store } from '@tomic/lib';
import { loadResourceTree } from '@tomic/svelte';
import { domain } from '$lib/helpers/domainSubjects';

/** Accepts base URL of server, pre-loads that resource and all children */
export async function getChildrenCollection(subject: string, store: Store) {
	const resource = await store.getResourceAsync(subject);
	const collectionWithoutSorting = resource.getChildrenCollection();

	const url = new URL(collectionWithoutSorting);

	url.searchParams.set(
		'sort_by',
		'https://atomicdata.dev/properties/published-at',
	);
	url.searchParams.set('sort_desc', 'true');

	const childrenCollection = url.toString();

	await loadResourceTree(subject, {
		[properties.parent]: true,
		[domain.pages]: true,
		[domain.coverImage]: true,
	});

	await loadResourceTree(childrenCollection, {
		[properties.collection.members]: {
			[domain.coverImage]: true,
		},
	});
	return childrenCollection;
}
