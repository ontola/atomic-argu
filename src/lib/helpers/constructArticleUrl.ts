import { currentSiteConfig } from './../siteConfigs';
import { page } from '$app/stores';
import { get } from 'svelte/store';
export const constructArticleUrl = (subject: string): string => {
	const currentURL = get(page).url;

	const path = subject.replace(currentSiteConfig.parentRoot, '');

	return path;
};
