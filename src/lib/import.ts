export async function importFiles() {
	const data = await import('./data-export/data.json');

  const resources = [
    ...data.Thread,
    ...data.Idee,
    ...data.Update,
  ];

  const atomicResources =  resources.map(mapResource)
  console.log(atomicResources);
}

function mapResource(resource: any) {
  const description = resource.description;
  const name = resource.display_name;
  // Here we use a regex to match the entire path:
  // e.g. `https://wonenatthepark.nl/m/60`
  // becomes `m/60`
  const localId =resource.iri.match(/\/\w+\/\w+/)[0].substring(1);
  // Only the date part of the ISO string
  const published_at = resource.published_at.substring(0, 10);

  return {
    "https://atomicdata.dev/properties/isA": ["https://atomicdata.dev/classes/Article"],
    "https://atomicdata.dev/properties/localId": localId,
    "https://atomicdata.dev/properties/original-url": resource.iri,
    "https://atomicdata.dev/properties/published-at": published_at,
    "https://atomicdata.dev/properties/name": name,
    "https://atomicdata.dev/properties/description": description
  };
}
