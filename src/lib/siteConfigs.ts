type SiteConfigIn = {
	// URL of the parent resource, used as the base of all resources
	parentRoot: string;
	// URL of an Argu-Site resource. Is generated from `parentRoot` by default.
	atomicSite?: string;
	// URL of folder where to upload files. Is generated from `parentRoot` by default.
	filesDir?: string;
	domain: string;
	deployType?: 'gh-pages' | 'netlify';
	// Path to the JSON file containing the Argu export, relative to the root of the project
	jsonPath: string;
	// Reges that matches the end of the path.
	// When unspecified, defaults
	regex?: RegExp;
};

export interface SiteConfig extends SiteConfigIn {
	// URL of the parent resource, used as the base of all resources
	parentRoot: string;
	// URL of an Argu-Site resource. Is generated from `parentRoot` by default.
	atomicSite: string;
	// URL of folder where to upload files. Is generated from `parentRoot` by default.
	filesDir: string;
	domain: string;
	deployType: 'gh-pages' | 'netlify';
	// Path to the JSON file containing the Argu export, relative to the root of the project
	jsonPath: string;
	// Reges that matches the end of the path.
	// When unspecified, defaults
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
		atomicSite: 'http://localhost:9883/argu-site-demo',
		parentRoot: 'http://localhost:9883/importer/7rg1o2n5l1',
		domain: 'localhost',
		jsonPath: './data-edamvolendam/data.json',
		regex: /\.co\/edam_volendam\/(.*)/,
		filesDir: 'http://localhost:9883/drive/75hhx0fjqgr/folder/xznlgeu7qf'
	},
	edam: {
		atomicSite: 'https://atomicdata.dev/edamvolendam/site',
		parentRoot: 'https://atomicdata.dev/importer/7n4ecrni2n',
		domain: 'localhost',
		jsonPath: './data-edamvolendam/data.json',
		regex: /\.co\/edam_volendam\/(.*)/
	},
	localArgu: {
		parentRoot: 'http://localhost:9883/drive/tswdtuh3d9/',
		domain: 'localhost',
		jsonPath: './data-argu-nl/data.json'
	}
};

// Fills default vals
function buildSiteConfig(config: SiteConfigIn): SiteConfig {
	return {
		atomicSite: config.atomicSite || `${config.parentRoot}/site`,
		filesDir: config.filesDir || `${config.parentRoot}/image-files`,
		deployType: config.deployType || 'netlify',
		regex: config.regex || /\.nl\/(.*)/,
		...config
	};
}

export const currentSiteConfig = buildSiteConfig(siteConfigs.localArgu);
