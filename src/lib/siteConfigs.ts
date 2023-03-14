type SiteConfigIn = {
	parentRoot: string;
	atomicSite?: string;
	filesDir?: string;
	domain?: string;
	deployType?: 'gh-pages' | 'netlify';
	jsonPath: string;
	regex?: RegExp;
};

export interface SiteConfig extends SiteConfigIn {
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
}

const siteConfigs: { [key: string]: SiteConfigIn } = {
	wonenAtThePark: {
		atomicSite: 'https://atomicdata.dev/wonenatthepark/site',
		parentRoot: 'https://atomicdata.dev/importer/l8mgzvvnm2a',
		deployType: 'gh-pages',
		domain: 'wonenatthepark.nl',
		jsonPath: './data-wonenatthepark/data.json'
	},
	localEdam: {
		parentRoot: 'http://localhost:9883/drive/aphjefochpg',
		jsonPath: './data-edamvolendam/data.json',
		regex: /\.co\/edam_volendam\/(.*)/
	},
	edam: {
		atomicSite: 'https://atomicdata.dev/edamvolendam/site',
		parentRoot: 'https://atomicdata.dev/importer/7n4ecrni2n',
		jsonPath: './data-edamvolendam/data.json',
		regex: /\.co\/edam_volendam\/(.*)/
	},
	localArgu: {
		parentRoot: 'http://localhost:9883/drive/tswdtuh3d9',
		jsonPath: './data-argu-nl/data.json'
	}
};

// Fills default vals, builds derived values from required fields.
function buildSiteConfig(config: SiteConfigIn): SiteConfig {
	return {
		atomicSite: config.atomicSite || `${config.parentRoot}/site`,
		filesDir: config.filesDir || `${config.parentRoot}/images-folder`,
		deployType: config.deployType || 'netlify',
		regex: config.regex || /\.nl\/(.*)/,
		domain: config.domain || new URL(config.parentRoot).hostname,
		...config
	};
}

export const currentSiteConfig = buildSiteConfig(siteConfigs.localArgu);
