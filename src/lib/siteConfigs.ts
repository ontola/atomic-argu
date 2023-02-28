export type SiteConfig = {
	// URL of an Argu-Site resource
	atomicSite: string;
	// Base URL of the Atomic-Server used
	serverUrl: string;
	// URL of folder where to upload files to
	filesDir?: string;
	// URL of the parent resource, used as the base of all resources
	parentRoot: string;
	domain: string;
	deployType: 'gh-pages' | 'netlify';
	// Path to the JSON file containing the Argu export, relative to the root of the project
	jsonPath: string;
	// Reges that
	regex: RegExp;
};

const siteConfigs: { [key: string]: SiteConfig } = {
	wonenAtThePark: {
		serverUrl: 'https://atomicdata.dev',
		atomicSite: 'https://atomicdata.dev/wonenatthepark/site',
		parentRoot: 'https://atomicdata.dev/importer/l8mgzvvnm2a',
		domain: 'wonenatthepark.nl',
		deployType: 'gh-pages',
		jsonPath: './data-wonenatthepark/data.json',
		regex: /\.nl\/(.*)/
	},
	localEdam: {
		serverUrl: 'http://localhost:9883',
		atomicSite: 'http://localhost:9883/argu-site-demo',
		parentRoot: 'http://localhost:9883/importer/7rg1o2n5l1',
		domain: 'localhost',
		deployType: 'gh-pages',
		jsonPath: './data-edamvolendam/data.json',
		regex: /\.co\/edam_volendam\/(.*)/,
		filesDir: 'http://localhost:9883/drive/75hhx0fjqgr/folder/xznlgeu7qf'
	},
	edam: {
		serverUrl: 'http://localhost:9883',
		atomicSite: 'https://atomicdata.dev/edamvolendam/site',
		parentRoot: 'https://atomicdata.dev/importer/7n4ecrni2n',
		domain: 'localhost',
		deployType: 'gh-pages',
		jsonPath: './data-edamvolendam/data.json',
		regex: /\.co\/edam_volendam\/(.*)/
	},
	localArgu: {
		serverUrl: 'http://localhost:9883',
		atomicSite: 'http://localhost:9883/drive/pawwvlm4mz/pg8bay2',
		parentRoot: 'http://localhost:9883/drive/pawwvlm4mz/importer/ymiirbneb5s',
		filesDir: 'http://localhost:9883/drive/pawwvlm4mz/folder/h3hoybvf4tc',
		domain: 'localhost',
		deployType: 'gh-pages',
		jsonPath: './data-argu-nl/data.json',
		regex: /\.nl\/(.*)/
	}
};

export const currentSiteConfig = siteConfigs.localArgu;
