import type { LayoutLoad } from './$types';
import { PUBLIC_SITE } from '$env/static/public';
import { getStore } from '$lib/helpers/getStore';
import { domain } from '$lib/helpers/domainSubjects';

// Used for static rendering
export const prerender = true;

export const load = (async () => {
	const store = getStore();

	const site = await store.getResourceAsync(PUBLIC_SITE);

	const color = site.get(domain.color);

	return { color };
}) satisfies LayoutLoad;
