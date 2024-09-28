import adapterNetlify from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { currentSiteConfig } from './prebuild/siteConfigs.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapterNetlify({
			edge: true, // Use Netlify Edge Functions instead of regular Functions
		}),
		prerender: {
			crawl: true,
			entries: ['/'],
			origin: currentSiteConfig.baseUrl, // Use the baseUrl from siteConfigs
		},
		// If you are not using a .nojekyll file, change your appDir to something not starting with an underscore.
		// For example, instead of '_app', use 'app_', 'internal', etc.
		appDir: 'app',
	},
};

export default config;
