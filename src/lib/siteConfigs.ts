import { defaultSiteId, defaultImageFolderId } from './template';

type SiteConfigIn = Partial<SiteConfig>;

type FontLink = {
	href: string;
	rel?: 'preconnect' | 'stylesheet';
	crossorigin?: boolean;
};

export interface SiteConfig {
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
	/** Site ID used by netlify CLI*/
	netlifyId?: string;
	customFont?: {
		links: FontLink[];
		fontFamily: string;
	};
}

const siteConfigs: { [key: string]: SiteConfigIn } = {
	wonenAtThePark: {
		atomicSite: 'https://atomicdata.dev/wonenatthepark/site',
		homeUrl: 'https://atomicdata.dev/importer/l8mgzvvnm2a',
		filesDir: 'https://atomicdata.dev/Folder/r4y4j88p7a',
		parentRoot: 'https://atomicdata.dev/importer/l8mgzvvnm2a',
		deployType: 'gh-pages',
		domain: 'wonenatthepark.nl',
		jsonPath: './data-wonenatthepark/data.json'
	},
	edamLocal: {
		parentRoot: 'http://localhost:9883/drive/krh6kkg09zr',
		jsonPath: './data-edamvolendam/data.json',
		regex: /\.co\/edam_volendam\/(.*)/
	},
	edam: {
		atomicSite: 'https://atomicdata.dev/edamvolendam/site',
		parentRoot: 'https://atomicdata.dev/importer/7n4ecrni2n',
		jsonPath: './data-edamvolendam/data.json',
		regex: /\.co\/edam_volendam\/(.*)/
	},
	arguLocal: {
		parentRoot: 'http://localhost:9883/drive/tswdtuh3d9',
		jsonPath: './data-argu-nl/data.json'
	},
	drechtstedenLocal: {
		parentRoot: 'https://staging.atomicdata.dev/drive/41w8ah24nx',
		homePath: 'forum',
		jsonPath: './data-drechtsteden/data.json',
		customFont: {
			links: [
				{ href: 'https://fonts.googleapis.com', rel: 'preconnect' },
				{ href: 'https://fonts.gstatic.com', rel: 'preconnect', crossorigin: true },
				{
					href: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap',
					rel: 'stylesheet'
				}
			],
			fontFamily: "'Roboto Condensed', sans-serif"
		}
	},
	drechtsteden: {
		parentRoot: 'https://atomicdata.dev/drive/tlqc9jtz5oj',
		original: 'https://denkmee.drechtstedenenergie.nl/denkmee',
		netlifyId: '7268e22c-04ee-4cea-a608-2bf1162596af',
		homePath: 'forum',
		jsonPath: './data-drechtsteden/data.json'
	},
	diaconessen: {
		parentRoot: 'https://atomicdata.dev/drive/7eqsy7w84eo',
		original: 'https://herontwikkelingdiaconessenhuis.nl/',
		jsonPath: './data-diaconessen/data.json'
	},
	sportlaan: {
		parentRoot: 'https://atomicdata.dev/drive/dxbdhd48i9r',
		original: 'https://herontwikkelingsportlaan.nl/',
		jsonPath: './data-sportlaan/data.json',
		homePath: 'herontwikkelingsportlaan'
	},
	sportlaanLocal: {
		parentRoot: 'http://localhost:9883/drive/eqom0z1l29t',
		original: 'https://herontwikkelingsportlaan.nl/',
		homePath: 'herontwikkelingsportlaan',
		jsonPath: './data-sportlaan/data.json'
	}
};

// Fills default vals, builds derived values from required fields.
function buildSiteConfig(config: SiteConfigIn): SiteConfig {
	const parentRoot = config.parentRoot;
	if (!parentRoot) throw new Error('Missing parentRoot in site config');
	const homePath = config.homePath || defaultSiteId;
	return {
		atomicSite: config.atomicSite || `${parentRoot}/${defaultSiteId}`,
		filesDir: config.filesDir || `${parentRoot}/${defaultImageFolderId}`,
		deployType: config.deployType || 'netlify',
		regex: config.regex || /\.nl\/(.*)/,
		domain: config.domain || new URL(parentRoot).hostname,
		homePath,
		homeUrl: config.homeUrl || `${parentRoot}/${homePath}`,
		...config
	} as SiteConfig;
}

export const currentSiteConfig = buildSiteConfig(siteConfigs.wonenAtThePark);
