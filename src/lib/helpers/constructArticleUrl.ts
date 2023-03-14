import { currentSiteConfig } from './../siteConfigs';
export const constructArticleUrl = (subject: string): string => {
	// const currentURL = get(page).url;

	if (subject === currentSiteConfig.atomicSite) return '/';

	const path = subject.replace(currentSiteConfig.parentRoot, '');

	return path;
};
