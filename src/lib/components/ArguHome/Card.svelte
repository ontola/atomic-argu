<script lang="ts">
	export let name: string;
	export let url: string;
</script>

<a href={url} class="card">
	<img src={`/arguhome/card_${name}.png`} alt={name} />
</a>

<style>
	.card {
		display: block;
		width: 100%;
		max-width: 300px;
		margin: 1rem;
		border-radius: 10px;
		transition: transform 0.2s;
	}
	.card:hover {
		transform: scale(1.05);
	}
	img {
		width: 100%;
		border-radius: 10px;
	}
</style>
