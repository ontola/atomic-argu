<script lang="ts">
	import { getResource, getValue } from '@tomic/svelte';

	export let subject: string;

	const resource = getResource(subject);

	const name = getValue<string>();
</script>
