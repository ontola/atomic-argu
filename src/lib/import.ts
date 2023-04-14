import { currentSiteConfig, type SiteConfig } from './siteConfigs';
import { Store, Agent, properties, importJsonAdString } from '@tomic/lib';
import { siteTemplate, templateToJSONAD } from './template';

interface LinkType {
	data: {
		id: string;
	};
}

const localIdUrl = 'https://atomicdata.dev/properties/localId';

interface ArguJSONResource {
	iri: string;
	is_draft: boolean;
	is_trashed: boolean;
	published_at: string;
	description: string;
	display_name: string;
	bio: string;
	used_as?: 'attachment' | 'cover';
	content: string;
	content_type: string;
	filename: string;
	default_cover_photo: LinkType;
	parent: LinkType;
	rdf_type: string;
}

// Just json key val
type AtomicJSONResource = {
	[key: string]: any;
};

function shouldInclude(r: AtomicJSONResource | undefined, ids: Set<string>) {
	if (r == undefined) {
		return false;
	}
	if (ids.has(r[localIdUrl])) {
		throw new Error(`Duplicate id ${r[localIdUrl]}`, r);
	}
	const parent = r[properties.parent];
	// Skip items that do not have a parent
	if (
		!ids.has(parent) &&
		parent !== currentSiteConfig.atomicSite &&
		parent !== currentSiteConfig.orgPath &&
		parent !== currentSiteConfig.homePath
	) {
		console.log(
			`skipping ${r[localIdUrl]}, parent ${parent} hasn't been processed yet. Could be trashed.`,
		);
		return false;
	}
	ids.add(r[localIdUrl]);
	return true;
}

export async function importFiles() {
	if (!window.location.href.includes('localhost')) {
		console.error(
			'This script can only be run on localhost! Otherwise you might have cors issues.',
		);
	}
	const siteConfig = currentSiteConfig;
	const secret = prompt("What's your secret?");
	if (!secret) {
		throw new Error('No secret provided');
	}
	const agent = Agent.fromSecret(secret);
	const store = new Store({
		serverUrl: new URL(siteConfig.atomicSite).origin,
		agent,
	});

	const resources: ArguJSONResource[] = [];

	// Creates the Site and Image folder
	const templateData = templateToJSONAD(siteTemplate);
	// upload to drive
	importJsonAdString(store, JSON.stringify(templateData), {
		parent: siteConfig.parentRoot,
	});

	const data = await import(siteConfig.jsonPath /* @vite-ignore */);

	const attachments = data['Bijlage'].filter(
		(r: ArguJSONResource) => r.used_as == 'attachment',
	);

	// The order should be dependent on the parent-child relationship,
	// because of how JSON-AD importing works on Atomic-Server.
	// The parent should be imported before the child.
	const order = [
		'Forum',
		'Traject',
		'Fase',
		'Thread',
		'Blog',
		'Uitdaging',
		'Idee',
		'Update',
		// NOTE: adjust the key for `Enquete` in the data, because the special char is not iterable in JSON
		'Enqute',
		'Nadeel',
		'Voordeel',
		'Reactie',
	];

	order.forEach(key => {
		if (!data[key]) {
			console.warn(
				`Type ${key} is missing, make sure it is not used in the imported Organisation`,
			);
			return;
		}
		resources.push(...data[key]);
	});

	// const atomicResources = await Promise.all(
	// 	// Instead of trying all resources in one batch, we
	// 	resources.map(async (r: any) => await mapResource(r, siteConfig, store))
	// );

	// We want the results to be handled one by one, not in parallel
	const atomicResources = [];
	for (const r of resources) {
		const mapped = await mapResource(r, siteConfig, store, attachments);
		atomicResources.push(mapped);
	}

	const ids: Set<string> = new Set();

	const atomicResourcesFiltered = atomicResources.filter(r =>
		shouldInclude(r, ids),
	);

	// Make sure the home resource is the first one
	const sorted = atomicResourcesFiltered.sort((a, b) => {
		if (a && a[localIdUrl] == siteConfig.homePath) {
			return -1;
		}
		if (b && b[localIdUrl] == siteConfig.homePath) {
			return 1;
		}
		return 0;
	});

	const jsonAD = JSON.stringify(sorted, null, 2);
	// upload to drive
	await importJsonAdString(store, jsonAD, {
		parent: siteConfig.parentRoot,
	});

	// // Copy to clipboard
	// await navigator.clipboard.writeText(jsonAD);
	// window.alert('JSON is being uploaded and has been copied to clipboard');
	window.alert('Done!');
}

// Here we use a regex to match the entire path:
// e.g. `https://wonenatthepark.nl/m/60`
// becomes `m/60`.
// But `https://wonenatthepark.nl`
// becomes `atomicSite` - the root resource and default parent.
function convertToLocalId(iri: string, siteConfig: SiteConfig) {
	const defaultParent = siteConfig.homePath;
	const matches = iri.match(siteConfig.regex);
	if (matches && matches[1].length > 0) {
		if (matches[1] == siteConfig.orgPath) {
			return defaultParent;
		}
		return matches[1];
	}
	// This should only happen if the iri is the root, in which case we use the `site` resource as the parent
	return defaultParent;
}

/** Returns uploaded file URLs */
function findAndUploadAttachments(
	resource: ArguJSONResource,
	siteConfig: SiteConfig,
	store: Store,
	allAttachments: ArguJSONResource[],
	localId: string,
): string[] {
	const fileAttachments = allAttachments.filter(
		a => convertToLocalId(a.parent.data.id, siteConfig) == localId,
	);

	const uploadedResources: string[] = [];
	// Upload the attachments
	fileAttachments.forEach(async a => {
		const file = await fetch(a.content);
		const blob = await file.blob();
		const fileData = new File([blob], a.filename, { type: a.content_type });

		const [attachmentResource] = await store.uploadFiles(
			[fileData],
			siteConfig.filesDir,
		);
		uploadedResources.push(attachmentResource);
	});

	return uploadedResources;
}

// Takes an Argu export JSON resource, creates a JSON-AD Article
async function mapResource(
	resource: ArguJSONResource,
	siteConfig: SiteConfig,
	store: Store,
	allAttachments: ArguJSONResource[],
): Promise<AtomicJSONResource | undefined> {
	if (resource.is_draft || resource.is_trashed) {
		return;
	}

	const classes = ['https://atomicdata.dev/classes/Article'];

	if (resource.rdf_type == 'https://argu.co/ns/core#ProArgument') {
		classes.push('https://atomicdata.dev/classes/pro');
	} else if (resource.rdf_type == 'https://argu.co/ns/core#ConArgument') {
		classes.push('https://atomicdata.dev/classes/con');
	}

	const coverImage = await uploadCover(resource, siteConfig, store);
	const localId = convertToLocalId(resource.iri, siteConfig);
	let parent = convertToLocalId(resource.parent.data.id, siteConfig);
	const published_at = new Date(resource.published_at).getTime();
	const description =
		(await getMarkdownLinksAndMoveImages(resource.description, store)) ||
		resource.bio ||
		'';
	const attachments = findAndUploadAttachments(
		resource,
		siteConfig,
		store,
		allAttachments,
		localId,
	);

	if (localId == parent) {
		parent = siteConfig.atomicSite;
	}

	const out = {
		'https://atomicdata.dev/properties/isA': classes,
		'https://atomicdata.dev/properties/localId': localId,
		'https://atomicdata.dev/properties/original-url': resource.iri,
		'https://atomicdata.dev/properties/published-at': published_at,
		'https://atomicdata.dev/properties/parent': parent,
		'https://atomicdata.dev/properties/attachments': attachments,
		'https://atomicdata.dev/properties/name':
			resource.display_name || 'reactie',
		// Cover image
		'https://atomicdata.dev/Folder/wp8ame4nqf/urHO7G8FKm': coverImage,
		'https://atomicdata.dev/properties/description': description,
	};

	// Remove null values
	return Object.fromEntries(Object.entries(out).filter(([, v]) => v != null));
}

// finds markdown image tags`
// and moves the image using uploadAndGetPictureURL.
// Replaces the URL with the new one
// Returns modified MD string
async function getMarkdownLinksAndMoveImages(
	md: string,
	store: Store,
): Promise<string | undefined> {
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

/** Returns URL of uploaded cover image */
async function uploadCover(
	resource: ArguJSONResource,
	siteConfig: SiteConfig,
	store: Store,
): Promise<string | undefined> {
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
async function moveImageToAtomic(
	url: string,
	siteConfig: SiteConfig,
	store: Store,
): Promise<string | undefined> {
	// download as bytes
	try {
		console.log(`moving image ${url}...`);
		const response = await fetch(url);
		if (!response.ok) {
			console.warn(`image ${url} not found, skipping upload`);
			return;
		}
		const blob = await response.blob();
		if (blob.size == 0) {
			console.warn(`image ${url} is empty, skipping upload`);
			return;
		}
		const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
		// upload to Atomic
		const parent = siteConfig.filesDir;
		const [created] = await store.uploadFiles([file], parent);
		return created;
	} catch (e) {
		console.error('error downloading / uploading image', e);
		return;
	}
}
