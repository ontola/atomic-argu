<script lang="ts">
	import Container from '../Container.svelte';
	import Block from './Block.svelte';
	import Card from './Card.svelte';
</script>

<Container>
	<div class="header">
		<div class="text">
			<!-- <h1>Argu</h1> -->
			<h1>Snelle en flexibele project websites</h1>
			<div>
				Gebouwd door
				<a href="https://ontola.io/nl/contact">Ontola </a>
			</div>
		</div>
		<img src="/arguhome/header.svg" alt="Productafbeelding" />
	</div>
	<div class="blocks">
		<Block title="Projectwebsites in jouw huisstijl" videoId="style"
			>Op jouw domeinnaam, met jouw afbeeldingen, kleuren en lettertypen</Block
		>
		<Block title="Eenvoudig te beheren" videoId="cms"
			>Bewerk pagina's en geef structuur aan jouw website met
			<a href="http://atomicserver.eu/">AtomicServer</a>, het CMS.</Block
		>
		<Block title="Zoek door alles" videoId="search"
			>Supersnel zoeken, zonder gedoe.</Block
		>
		<Block title="Super snel" imageId="speed.jpg"
			>Pagina's laden direct - en dat maakt jouw bezoekers blij!</Block
		>
		<Block title="Open Source" imageId="opensource.jpg"
			>Alle broncode van <a href="https://github.com/ontola/atomic-argu/issues"
				>Argu</a
			>
			staat op github, net zoals ons
			<a href="https://atomicserver.eu">AtomicServer</a>
			CMS.</Block
		>
		<Block title="Alles kan anders" imageId="custom.jpg"
			>Maatwerk nodig? Gaan we voor je regelen!</Block
		>
	</div>
	<h2>Voorbeeld websites</h2>
	<div class="cards">
		<Card name="edam" url="https://edamvolendam.argu.co/" />
		<Card name="randstad" url="https://randstad2177.nl/" />
		<Card name="drechtsteden" url="https://denkmee.drechtstedenenergie.nl/" />
	</div>
	<h2>Interesse?</h2>
	<div class="c2a-wrapper">
		<a class="button" href="https://ontola.io/nl/contact">Neem contact op!</a>
	</div>
</Container>

<style>
	.header {
		padding-top: 5rem;
		width: 100%;
		display: grid;
		align-items: center;
		justify-content: space-between;
		grid-template-areas: 'image' 'text';
		grid-template-columns: 1fr;
	}
	.header img {
		width: 100%;
		grid-area: image;
	}
	.header a {
		text-decoration: underline;
	}
	.text {
		display: grid;
		grid-area: text;
	}
	.text div {
		font-size: var(--font-size-fluid-1);
	}
	.text h1 {
		font-size: var(--font-size-fluid-3);
		/* font-size: 3rem; */
		font-weight: 800;
		margin: 0;
		line-height: 1em;
	}
	/* grid of 3 cards */
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-gap: 2rem;
	}
	.c2a-wrapper {
		display: grid;
		margin-top: 1rem;
		justify-content: start;
		margin-bottom: 3rem;
	}
	.c2a {
		padding: 5rem 0;
		font-size: var(--font-size-fluid-1);
		margin-bottom: 5rem;
	}
	.button {
		background-color: hsl(4, 62%, 50%);
		color: white;
		padding: 1rem 2rem;
		border-radius: 0.5rem;
	}
	.button:hover {
		background-color: hsl(4, 62%, 40%);
	}
	/* zig-zag, single column, responsive */
	.blocks {
		padding-top: 10rem;
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: min-content;
	}
	/* media query blocks */
	@media (min-width: 800px) {
		.header {
			/* Show beneath each other */
			grid-template-areas: 'text image';
			grid-template-columns: 1fr 1fr;
		}
		.blocks {
			gap: 10rem;
		}
	}
</style>
