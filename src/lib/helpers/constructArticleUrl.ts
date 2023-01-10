import { PUBLIC_RESOURCE_PARENT } from '$env/static/public';
import { page } from '$app/stores';
import { get } from 'svelte/store';
export const constructArticleUrl = (subject: string): string => {
	const currentURL = get(page).url;

	const path = subject.replace(PUBLIC_RESOURCE_PARENT, '');

	return new URL(path, currentURL).href;
};
