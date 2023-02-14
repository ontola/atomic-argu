export type SiteConfig = {
	// URL of an Argu-Site resource
	atomicSite: string;
	// URL of the parent resource, used as the base of all resources
	parentRoot: string;
	domain: string;
	deployType: 'gh-pages' | 'netlify';
	// Path to the JSON file containing the Argu export, relative to the root of the project
	jsonPath: string;
	// Reges that
	regex: RegExp;
};

export const siteConfigs: { [key: string]: SiteConfig } = {
	wonenAtThePark: {
		atomicSite: 'https://atomicdata.dev/wonenatthepark/site',
		parentRoot: 'https://atomicdata.dev/importer/l8mgzvvnm2a',
		domain: 'wonenatthepark.nl',
		deployType: 'gh-pages',
		jsonPath: './data-edamvolendam/data.json',
		regex: /\.co\/edam_volendam\/(.*)/
	}
};
