export async function importFiles() {
  // Data consists of `Thread`, `Message` and `User` keys, each with an array of resources
	const data = await import('../../data-export/data.json');
	console.log(data);

  const resources = [
    ...data.Thread,
    ...data.Idee,
    ...data.Update,
  ];

  for (const resource of resources) {
    const resourceData = mapResource(resource);
    console.log(resourceData);
  }

}

/** Converts */
function mapResource(resource: any) {
  const description = resource.description;
  const name = resource.name;
  const localId = resource.iri.split('/').pop();

  return {
    "https://atomicdata.dev/properties/localId": localId,
    "https://atomicdata.dev/properties/name": name,
    "https://atomicdata.dev/properties/description": description
  };
}
