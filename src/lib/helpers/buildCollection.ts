import { properties } from '@tomic/lib';
import { loadResourceTree } from '@tomic/svelte';
import { domain } from '$lib/helpers/domainSubjects';

export async function buildCollection(subject: string) {
	await loadResourceTree(subject, {
		[properties.parent]: true,
		[domain.pages]: true,
		[domain.coverImage]: true,
		[domain.articlesCollection]: {
			[properties.collection.members]: {
				[domain.coverImage]: true
			}
		}
	});

	// We create a collection that contains all children of the current Subject
	const generatedCollectionURL = new URL(subject);
	generatedCollectionURL.pathname = '/collections';
	generatedCollectionURL.searchParams.set(
		'sort_by',
		'https://atomicdata.dev/properties/published-at'
	);
	generatedCollectionURL.searchParams.set('property', properties.parent);
	generatedCollectionURL.searchParams.set('value', subject);

	const childrenCollection = generatedCollectionURL.toString();

	await loadResourceTree(childrenCollection, {
		[properties.collection.members]: true
	});
	return childrenCollection;
}
