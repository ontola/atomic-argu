export async function importFiles() {
	const data = await import('./data-edamvolendam/data.json');

  // The order should be dependent on the parent-child relationship,
  // because of how JSON-AD importing works.
  const resources = [
    ...data.Forum,
    ...data.Thread,
    ...data.Uitdaging,
    ...data.Idee,
    ...data.Update,
    // ...data.Enquête,
    ...data.Nadeel,
    ...data.Voordeel,
  ];

  const atomicResources =  resources.map(mapResource).filter(i => i);
  console.log(atomicResources);
  await navigator.clipboard.writeText(JSON.stringify(atomicResources));
  window.alert("JSON copied to clipboard")
}

// Here we use a regex to match the entire path:
// e.g. `https://wonenatthepark.nl/m/60`
// becomes `m/60`.
// And `https://wonenatthepark.nl`
// becomes `home`
function convertToLocalId(iri: string) {
  // regex selects anything starting from '.co/edam_volendam/'
  const matches = iri.match(/\.co\/edam_volendam\/(.*)/);
  if (matches) {
    return matches[1];
  }
  // This should only happen if the iri is the root, in which case we use the `site` resource as the parent
  return "https://atomicdata.dev/edamvolendam/site";
}

function mapResource(resource: any) {
  if (resource.is_draft) {
    return;
  }

  const description = resource.description;
  const name = resource.display_name;
  const localId = convertToLocalId(resource.iri)
  const parent = convertToLocalId(resource.parent.data.id)
  // Only the date part of the ISO string
  const published_at = resource.published_at.substring(0, 10);

  return {
    "https://atomicdata.dev/properties/isA": ["https://atomicdata.dev/classes/Article"],
    "https://atomicdata.dev/properties/localId": localId,
    "https://atomicdata.dev/properties/original-url": resource.iri,
    "https://atomicdata.dev/properties/published-at": published_at,
    "https://atomicdata.dev/properties/parent": parent,
    "https://atomicdata.dev/properties/name": name,
    "https://atomicdata.dev/properties/description": description
  };
}
