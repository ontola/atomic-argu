import { properties } from '@tomic/lib';
import { domain } from './helpers/domainSubjects';
type Template = TemplateResource[];

/** Will be converted */
type TemplateResource = {
	// local-id, will be mapped to @id during import
	id: string;
	/** URL of the Class. Will be converted to a ResourceArray */
	class: string;
	name?: string;
	description?: string;
	parent?: string;
	children?: TemplateResource[];
	// Note: needs to be atomic data property-value!
	[key: string]: any;
};

const URL_ARGU_SITE_CLASS = 'https://atomicdata.dev/Folder/wp8ame4nqf/MYJkFKGEKz';

const siteTemplate: TemplateResource[] = [
	{
		id: 'site',
		class: URL_ARGU_SITE_CLASS,
		name: 'Site Example',
		description: 'This is an example site',
		[properties.read]: ['https://atomicdata.dev/agents/publicAgent'],
		[domain.color]: 'hsl(138, 15%, 44%)',
		[domain.pages]: ['article-demo'],
		[domain.siteImage]: 'https://docs.atomicdata.dev/favicon.png',
		children: [
			{
				id: 'article-demo',
				name: 'some article',
				description: 'This is a demo article',
				'https://atomicdata.dev/properties/published-at': 1678798959855000,
				class: 'https://atomicdata.dev/classes/Article'
			}
		]
	},
	{
		id: 'images-folder',
		class: 'https://atomicdata.dev/classes/Folder',
		name: 'Images folder',
		'https://atomicdata.dev/property/display-style': 'https://atomicdata.dev/display-style/list'
	}
];

function toJSONAD(template: Template) {
	const out: any[] = [];
	template.map((resource) => {
		out.push(convertAndFlatten(resource).flat());
	});
	// flatten
	return out.flat();
}

function convertAndFlatten(resource: TemplateResource, parent?: string): any[] {
	const { id, children, name, description, class: klass, ...rest } = resource;

	const out: any[] = [];

	// Since we don't have dynamic children showing yet, we should add sub-resources instead
	const subResources = children?.map((child) => child.id);

	out.push({
		'https://atomicdata.dev/properties/localId': id,
		[properties.isA]: [klass],
		[properties.name]: name,
		[properties.description]: description,
		[properties.parent]: parent,
		[properties.subResources]: subResources,
		...rest
		// Children is omitted, processed below
	});
	console.log('out', out);

	// Parse children recursively,
	// remove the `children` key and
	// replace with `parent` set to the `id` of the parent
	if (children) {
		children.map((child) => {
			out.push(convertAndFlatten(child, id));
		});
	}
	out.flat();
	return out;
}

export const generatedTemplate = async () => {
	const arr = toJSONAD(siteTemplate);
	console.log(arr);

	const pretty = JSON.stringify(arr, null, 2);
	await navigator.clipboard.writeText(pretty);
};
