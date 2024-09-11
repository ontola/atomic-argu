import { currentSiteConfig } from './../../lib/siteConfigs';
import { getStore } from '$lib/helpers/getStore';
import { error, redirect } from '@sveltejs/kit';
import { getResource } from '@tomic/svelte';
import type { PageLoad } from './$types';
import { getChildrenCollection } from '$lib/helpers/buildCollection';

export const load = (async ({ params, fetch }) => {
	const store = getStore();

	store.injectFetch(fetch);

	if (
		currentSiteConfig.netlifyId == 'drechtsteden' &&
		params.path === 'denkmee'
	) {
		throw redirect(302, '/');
	}
	if (currentSiteConfig.netlifyId == 'arguco' && params.path === 'info') {
		throw redirect(302, '/');
	}

	if (params.path.startsWith('edam_volendam')) {
		throw redirect(
			302,
			`https://edamvolendam.argu.co/${params.path.replace(
				'edam_volendam/',
				'',
			)}`,
		);
	}

	const modifiedPath = params.path.replace('new-article', 'New-Article');
	const subject = `${currentSiteConfig.parentRoot}/${modifiedPath}`;
	await store.fetchResourceFromServer(subject);
	const r = await store.getResourceAsync(subject);

	if (r.error) {
		throw error(500, r.error.message);
	}

	const childrenCollection = await getChildrenCollection(subject);

	return {
		childrenCollection,
		resource: getResource(subject),
	};
}) satisfies PageLoad;
