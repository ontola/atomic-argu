import { PUBLIC_SITE } from '$env/static/public';
import { siteConfigs, type SiteConfig } from './siteConfigs';

export async function importFiles(siteConfig: SiteConfig = siteConfigs.wonenAtThePark) {
	const data = await import(siteConfig.jsonPath);

	// The order should be dependent on the parent-child relationship,
	// because of how JSON-AD importing works on Atomic-Server.
	// The parent should be imported before the child.
	const resources = [
		...data.Forum,
		...data.Thread,
		...data.Uitdaging,
		...data.Idee,
		...data.Update,
		// NOTE: adjust the key here, because the special char is not iterable in JSON
		...data.Enqute,
		...data.Nadeel,
		...data.Voordeel,
		...data.Reactie
	];

	const atomicResources = resources.map((r) => mapResource(r, siteConfig));

	// Copy to clipboard
	console.log(atomicResources);
	await navigator.clipboard.writeText(JSON.stringify(atomicResources));
	window.alert('JSON copied to clipboard');
}

// Here we use a regex to match the entire path:
// e.g. `https://wonenatthepark.nl/m/60`
// becomes `m/60`.
// But `https://wonenatthepark.nl`
// becomes `PUBLIC_SITE` - the root resource and default parent.
function convertToLocalId(iri: string, siteConfig: SiteConfig) {
	// regex selects anything starting from '.co/edam_volendam/'
	const matches = iri.match(siteConfig.regex);
	if (matches) {
		return matches[1];
	}
	// This should only happen if the iri is the root, in which case we use the `site` resource as the parent
	return PUBLIC_SITE;
}

// Takes an Argu export JSON resource, creates a JSON-AD Article
function mapResource(resource: any, siteConfig: SiteConfig) {
	if (resource.is_draft) {
		return;
	}

	const localId = convertToLocalId(resource.iri, siteConfig);
	const parent = convertToLocalId(resource.parent.data.id, siteConfig);
	const published_at = new Date(resource.published_at).getTime();

	const out = {
		'https://atomicdata.dev/properties/isA': ['https://atomicdata.dev/classes/Article'],
		'https://atomicdata.dev/properties/localId': localId,
		'https://atomicdata.dev/properties/original-url': resource.iri,
		'https://atomicdata.dev/properties/published-at': published_at,
		'https://atomicdata.dev/properties/parent': parent,
		'https://atomicdata.dev/properties/name': resource.display_name,
		'https://atomicdata.dev/properties/description': resource.description || resource.bio || ''
	};

	// Remove null values
	return Object.fromEntries(Object.entries(out).filter(([, v]) => v != null));
}
