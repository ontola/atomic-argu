import { PUBLIC_RESOURCE_PARENT } from '$env/static/public';
import { domain } from '$lib/helpers/domainSubjects';
import { getStore } from '$lib/helpers/getStore';
import { error } from '@sveltejs/kit';
import { getResource, loadResourceTree } from '@tomic/svelte';
import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	const store = getStore();

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
