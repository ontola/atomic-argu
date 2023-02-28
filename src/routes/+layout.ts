import { currentSiteConfig } from './../lib/siteConfigs';
import type { LayoutLoad } from './$types';
import { getStore } from '$lib/helpers/getStore';
import { domain } from '$lib/helpers/domainSubjects';

// Used for static rendering
export const prerender = true;

export const load = (async () => {
	const store = getStore();

	const site = await store.getResourceAsync(currentSiteConfig.atomicSite);

	const color = site.get(domain.color);

	return { color };
}) satisfies LayoutLoad;
