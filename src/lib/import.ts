import { currentSiteConfig, type SiteConfig } from './siteConfigs';
import { Store, Agent } from '@tomic/lib';
import { PUBLIC_AGENT_PASSPHRASE } from '$env/static/public';

export async function importFiles() {
	const siteConfig = currentSiteConfig;
	if (!PUBLIC_AGENT_PASSPHRASE) {
		throw new Error('No AGENT_PASSPHRASE found in env');
	}
	const agent = Agent.fromSecret(PUBLIC_AGENT_PASSPHRASE);
	const store = new Store({
		serverUrl: new URL(siteConfig.atomicSite).origin,
		agent
	});
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
		// ...data.Enqute,
		...data.Nadeel,
		...data.Voordeel,
		...data.Reactie
	];

	// const atomicResources = resources.map(async (r) => await mapResource(r, siteConfig, store));
	const atomicResources = await Promise.all(
		// Instead of trying all resources in one batch, we
		resources.map(async (r) => await mapResource(r, siteConfig, store))
	);

	const atomicResourcesLimited = atomicResources.slice(0, 10).filter((r) => r !== undefined);

	// Copy to clipboard
	console.log(atomicResources);
	const pretty = JSON.stringify(atomicResourcesLimited, null, 2);
	await navigator.clipboard.writeText(pretty);
	window.alert('JSON copied to clipboard');
}

// Here we use a regex to match the entire path:
// e.g. `https://wonenatthepark.nl/m/60`
// becomes `m/60`.
// But `https://wonenatthepark.nl`
// becomes `atomicSite` - the root resource and default parent.
function convertToLocalId(iri: string, siteConfig: SiteConfig) {
	const matches = iri.match(siteConfig.regex);
	if (matches && matches[1].length > 0) {
		return matches[1];
	}
	// This should only happen if the iri is the root, in which case we use the `site` resource as the parent
	return siteConfig.atomicSite;
}

// Takes an Argu export JSON resource, creates a JSON-AD Article
async function mapResource(resource: any, siteConfig: SiteConfig, store: Store) {
	if (resource.is_draft) {
		return;
	}

	console.log('Mapping resource', resource);

	const uploadedImage = await uploadAndGetPictureURL(resource, siteConfig, store);

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
		// Cover image
		'https://atomicdata.dev/Folder/wp8ame4nqf/urHO7G8FKm': uploadedImage,
		'https://atomicdata.dev/properties/description': resource.description || resource.bio || ''
	};

	// Remove null values
	return Object.fromEntries(Object.entries(out).filter(([, v]) => v != null));
}

//
async function uploadAndGetPictureURL(resource: any, siteConfig: SiteConfig, store: Store) {
	return null;
	const pic = resource?.default_cover_photo?.data?.id;
	if (!pic) {
		return;
	}
	const fullPic = `${pic}/content/cover`;

	if (siteConfig.filesDir === undefined) {
		console.log('No filesDir specified in siteConfig, skipping upload');
		return;
	}

	// download as bytes
	const response = await fetch(fullPic);
	const blob = await response.blob();
	const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

	// upload to Atomic
	const parent = siteConfig.filesDir;
	const [created] = await store.uploadFiles([file], parent);
	return created;
}
