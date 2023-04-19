import { defaultSiteId, defaultImageFolderId } from './template';

type SiteConfigIn = Partial<SiteConfig>;

type FontLink = {
	href: string;
	rel?: 'preconnect' | 'stylesheet';
	crossorigin?: boolean;
};

export interface SiteConfig {
	/** URL of the Atomic Server the data is hosted on */
	serverUrl: string;
	/** URL of the parent resource, used as the base of all resources */
	parentRoot: string;
	/** URL of the Argu-Site resource, is shown on the home page */
	atomicSite: string;
	/** URL of folder where to upload files. Is generated from `parentRoot` by default. */
	filesDir: string;
	/** DNS domain name, e.g. argu.nl */
	domain: string;
	deployType: 'gh-pages' | 'netlify';
	/** Path to the JSON file containing the Argu export, relative to the root of the project */
	jsonPath: string;
	/** Regex that matches the end of the path. If not provided, we'll assume it's targeting a `.nl` domain */
	regex: RegExp;
	/** Original website URL */
	original?: string;
	/** Path rendered on the home page, relative to the `parentRoot`. Defaults to the `site`. In Argu, this is often named the same as the organisation */
	homePath: string;
	/** URL of the home page resource, derived from homePath*/
	homeUrl: string;
	/** An optional path that is prepended to all URLs. */
	orgPath?: string;
	/** Site ID used by netlify CLI*/
	netlifyId?: string;
	customFont?: {
		links: FontLink[];
		fontFamily: string;
	};
	whiteHeader?: boolean;
	headingTextColor?: string;
	bodyTextColor?: string;
}

const siteConfigs = {
	wonenAtThePark: {
		atomicSite: 'https://atomicdata.dev/wonenatthepark/site',
		homeUrl: 'https://atomicdata.dev/importer/l8mgzvvnm2a',
		filesDir: 'https://atomicdata.dev/Folder/r4y4j88p7a',
		parentRoot: 'https://atomicdata.dev/importer/l8mgzvvnm2a',
		deployType: 'gh-pages',
		domain: 'wonenatthepark.nl',
		jsonPath: './data/wonenatthepark.json',
	},
	edam: {
		// parentRoot: 'http://localhost:9883/drive/8a1yuuzcl3',
		parentRoot: 'https://atomicdata.dev/drive/xpectln6zf',
		jsonPath: './data/edamvolendam.json',
		homePath: 'Edam_Volendam',
		regex: /\.co\/edam_volendam\/(.*)/,
		whiteHeader: true,
		headingTextColor: 'rgb(78 62 88)',
	},
	argunl: {
		// parentRoot: 'http://localhost:9883/drive/u6n66u5s5mg',
		parentRoot: 'https://atomicdata.dev/drive/9wtmc8uk1il',
		homePath: 'forum',
		netlifyId: 'argunl',
		jsonPath: './data/argu-nl.json',
	},
	arguco: {
		parentRoot: 'http://localhost:9883/drive/vepy10gbnm',
		regex: /\.co\/(.*)/,
		homePath: 'argu',
		netlifyId: 'arguco',
		jsonPath: './data/argu-co.json',
		whiteHeader: true,
		headingTextColor: '#000000',
		bodyTextColor: '#0D325A',
	},
	drechtsteden: {
		parentRoot: 'https://atomicdata.dev/drive/tlqc9jtz5oj',
		// parentRoot: 'https://staging.atomicdata.dev/drive/41w8ah24nx',
		// parentRoot: 'http://localhost:9883/drive/ybf4mmk4jlq',
		original: 'https://denkmee.drechtstedenenergie.nl/denkmee',
		netlifyId: 'drechtsteden',
		homePath: 'denkmee/forum',
		orgPath: 'denkmee',
		jsonPath: './data/drechtsteden.json',
		// regex: /\.nl\/denkmee\/(.*)/,
		customFont: {
			links: [
				{ href: 'https://fonts.googleapis.com', rel: 'preconnect' },
				{
					href: 'https://fonts.gstatic.com',
					rel: 'preconnect',
					crossorigin: true,
				},
				{
					href: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap',
					rel: 'stylesheet',
				},
			],
			fontFamily: "'Roboto Condensed', sans-serif",
		},
		whiteHeader: true,
		headingTextColor: '#0D325A',
		bodyTextColor: '#0D325A',
	},
	diaconessen: {
		parentRoot: 'https://atomicdata.dev/drive/hms3fnoue08',
		original: 'https://herontwikkelingdiaconessenhuis.nl/',
		homePath: 'denkmee',
		jsonPath: './data/diaconessen.json',
		netlifyId: 'diacon',
	},
	sportlaan: {
		parentRoot: 'https://atomicdata.dev/drive/g9fuuv7qcej',
		original: 'https://herontwikkelingsportlaan.nl/',
		jsonPath: './data/sportlaan.json',
		homePath: 'herontwikkelingsportlaan',
	},
	randstad2177: {
		parentRoot: 'https://atomicdata.dev/drive/xguajxank6b',
		original: 'https://randstad2177.nl/',
		homePath: 'home',
		jsonPath: './data/randstad2177.json',
		netlifyId: 'randstad2177',
	},
} satisfies { [key: string]: SiteConfigIn };

// Fills default vals, builds derived values from required fields.
function buildSiteConfig(config: SiteConfigIn): SiteConfig {
	const parentRoot = config.parentRoot;
	if (!parentRoot) throw new Error('Missing parentRoot in site config');
	const homePath = config.homePath || defaultSiteId;
	return {
		serverUrl: config.serverUrl || new URL(parentRoot).origin,
		atomicSite: config.atomicSite || `${parentRoot}/${defaultSiteId}`,
		filesDir: config.filesDir || `${parentRoot}/${defaultImageFolderId}`,
		deployType: config.deployType || 'netlify',
		regex: config.regex || /\.nl\/(.*)/,
		domain: config.domain || new URL(parentRoot).hostname,
		homePath,
		homeUrl: config.homeUrl || `${parentRoot}/${homePath}`,
		...config,
	} as SiteConfig;
}

export const currentSiteConfig = buildSiteConfig(siteConfigs.arguco);
