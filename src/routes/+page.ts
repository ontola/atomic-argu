import { PUBLIC_SITE } from '$env/static/public';
import { domain } from '$lib/helpers/domainSubjects';
import { getStore } from '$lib/helpers/getStore';
import { urls } from '@tomic/lib';
import { getResource, loadResourceTree } from '@tomic/svelte';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const store = getStore();

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
