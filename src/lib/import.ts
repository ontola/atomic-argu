import { currentSiteConfig, type SiteConfig } from './siteConfigs';
import { Store, Agent, properties, importJsonAdString } from '@tomic/lib';
import { PUBLIC_AGENT_PASSPHRASE } from '$env/static/public';
import { siteTemplate, templateToJSONAD } from './template';

function shouldInclude(r: any, ids: Set<string>) {
	if (r == undefined) {
		return false;
	}
	const parent = r[properties.parent];
	// Skip items that do not have a parent
	if (!ids.has(parent) && parent !== currentSiteConfig.atomicSite) {
		console.log('skipping', r['https://atomicdata.dev/properties/localId']);
		return false;
	}
	ids.add(r['https://atomicdata.dev/properties/localId']);
	return true;
}

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

	const resources: any = [];

	// Creates the Site and Image folder
	const templateData = templateToJSONAD(siteTemplate);
	resources.push(...templateData);

	const data = await import(siteConfig.jsonPath);

	// The order should be dependent on the parent-child relationship,
	// because of how JSON-AD importing works on Atomic-Server.
	// The parent should be imported before the child.
	const order = [
		'Forum',
		'Thread',
		'Uitdaging',
		'Traject',
		'Fase',
		'Idee',
		'Update',
		// NOTE: adjust the key here, because the special char is not iterable in JSON
		'Enqute',
		'Nadeel',
		'Voordeel',
		'Reactie'
	];

	order.forEach((key) => {
		if (!data[key]) {
			console.warn(`Type ${key} is missing, make sure it is not used in the imported Organisation`);
			return;
		}
		resources.push(...data[key]);
	});

	// const atomicResources = resources.map(async (r) => await mapResource(r, siteConfig, store));
	const atomicResources = await Promise.all(
		// Instead of trying all resources in one batch, we
		resources.map(async (r: any) => await mapResource(r, siteConfig, store))
	);

	const ids: Set<string> = new Set();
	const atomicResourcesFiltered = atomicResources.filter((r) => shouldInclude(r, ids));

	const jsonAD = JSON.stringify(atomicResourcesFiltered, null, 2);
	// upload to drive
	importJsonAdString(store, jsonAD, {
		parent: siteConfig.parentRoot
	});

	// Copy to clipboard
	await navigator.clipboard.writeText(jsonAD);
	window.alert('JSON is being uploaded and has been copied to clipboard');
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

	const uploadedImage = await uploadAndGetPictureURL(resource, siteConfig, store);

	const localId = convertToLocalId(resource.iri, siteConfig);
	const parent = convertToLocalId(resource.parent.data.id, siteConfig);
	const published_at = new Date(resource.published_at).getTime();
	const description =
		(await getMarkdownLinksAndMoveImages(resource.description, store)) || resource.bio || '';

	const out = {
		'https://atomicdata.dev/properties/isA': ['https://atomicdata.dev/classes/Article'],
		'https://atomicdata.dev/properties/localId': localId,
		'https://atomicdata.dev/properties/original-url': resource.iri,
		'https://atomicdata.dev/properties/published-at': published_at,
		'https://atomicdata.dev/properties/parent': parent,
		'https://atomicdata.dev/properties/name': resource.display_name || 'reactie',
		// Cover image
		'https://atomicdata.dev/Folder/wp8ame4nqf/urHO7G8FKm': uploadedImage,
		'https://atomicdata.dev/properties/description': description
	};

	// Remove null values
	return Object.fromEntries(Object.entries(out).filter(([, v]) => v != null));
}

// finds markdown image tags`
// and moves the image using uploadAndGetPictureURL.
// Replaces the URL with the new one
async function getMarkdownLinksAndMoveImages(md: string, store: Store) {
	if (!md) {
		return;
	}
	const regex = /!\[.*?\]\((.*?)\)/g;
	const matches = md.matchAll(regex);
	const newMd = md;
	for (const match of matches) {
		const url = match[1];
		console.log(`found image URL: ${url}`);
		let newUrl = await moveImageToAtomic(url, currentSiteConfig, store);
		// prepend with /download in path
		if (newUrl) {
			newUrl = newUrl.replace('/files/', '/download/files/');
			console.log(`converted image: old ${url}, new ${newUrl}`);
			newMd.replace(url, newUrl);
		}
	}

	return newMd;
}

async function uploadAndGetPictureURL(resource: any, siteConfig: SiteConfig, store: Store) {
	// Skip if needed
	// return null;
	const pic = resource?.default_cover_photo?.data?.id;
	if (!pic) {
		return;
	}
	const fullPic = `${pic}/content/cover`;

	if (siteConfig.filesDir === undefined) {
		console.log('No filesDir specified in siteConfig, skipping upload');
		return;
	}

	const imageResourceURL = await moveImageToAtomic(fullPic, siteConfig, store);

	return imageResourceURL;
}

/** Returns resource URL of the image (not the download URL). If it fails, it does not return a URL */
async function moveImageToAtomic(url: string, siteConfig: SiteConfig, store: Store) {
	// download as bytes
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
		// upload to Atomic
		const parent = siteConfig.filesDir;
		const [created] = await store.uploadFiles([file], parent);
		return created;
	} catch (e) {
		console.log('error downloading / uploading image', e);
		return;
	}
}
