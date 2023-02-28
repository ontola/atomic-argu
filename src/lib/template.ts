type Template = TemplateResource[];

/** Will be converted */
type TemplateResource = {
	// local-id, will be mapped to @id during import
	id: string;
	/** URL of the Class. Will be converted to a ResourceArray */
	class: string;
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
		'https://atomicdata.dev/properties/read': ['https://atomicdata.dev/agents/publicAgent'],
		children: [
			{
				id: 'article-demo',
				name: 'some article',
				class: 'https://atomicdata.dev/classes/Article'
			}
		]
	},
	{
		id: 'images-folder',
		class: 'https://atomicdata.dev/classes/Folder'
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
	const { id, children, name, class: klass, ...rest } = resource;

	const out: any[] = [];

	out.push({
		'https://atomicdata.dev/properties/localId': id,
		'https://atomicdata.dev/properties/name': name,
		'https://atomicdata.dev/properties/parent': parent,
		'https://atomicdata.dev/properties/isA': [klass],
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
	await navigator.clipboard.writeText(JSON.stringify(arr));
};
