type SiteConfigIn = Partial<SiteConfig>;

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
	/** Regex that matches the end of the path.*/
	regex: RegExp;
	/** Original website URL */
	original?: string;
}

const siteConfigs: { [key: string]: SiteConfigIn } = {
	wonenAtThePark: {
		atomicSite: 'https://atomicdata.dev/wonenatthepark/site',
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
		parentRoot: 'http://localhost:9883/drive/2n7alfvryty',
		regex: /\.nl\/denkmee\/(.*)/,
		jsonPath: './data-drechtsteden/data.json'
	},
	drechtsteden: {
		parentRoot: 'https://atomicdata.dev/drive/tlqc9jtz5oj',
		original: 'https://denkmee.drechtstedenenergie.nl/denkmee',
		regex: /\.nl\/denkmee\/(.*)/,
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
		jsonPath: './data-sportlaan/data.json'
	}
};

// Fills default vals, builds derived values from required fields.
function buildSiteConfig(config: SiteConfigIn): SiteConfig {
	const parentRoot = config.parentRoot;
	if (!parentRoot) throw new Error('Missing parentRoot in site config');

	return {
		atomicSite: config.atomicSite || `${parentRoot}/site`,
		filesDir: config.filesDir || `${parentRoot}/images-folder`,
		deployType: config.deployType || 'netlify',
		regex: config.regex || /\.nl\/(.*)/,
		domain: config.domain || new URL(parentRoot).hostname,
		...config
	} as SiteConfig;
}

export const currentSiteConfig = buildSiteConfig(siteConfigs.edamLocal);
