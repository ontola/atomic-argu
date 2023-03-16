import { currentSiteConfig } from './../siteConfigs';
export const constructArticleUrl = (subject: string): string => {
	if (subject === currentSiteConfig.homeUrl) return '/';

	const path = subject.replace(currentSiteConfig.parentRoot, '');

	return path;
};
