<script>
	import Container from '$lib/components/Container.svelte';
	import HeroPage from '$lib/components/HeroPage.svelte';
</script>

<HeroPage src="/home_hero.jpeg">
	<svelte:fragment slot="title-card">
		<h1>Wonen at the Park</h1>
		<p>Op deze website vindt u alle informatie omtrent wonen At the Park</p>
	</svelte:fragment>

	<Container>
		<h2>The lorum</h2>
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur exercitationem deserunt
			perspiciatis, debitis ea iure tempora assumenda dicta delectus consequuntur eaque, nemo quia
			ab doloremque, quidem fugit optio esse temporibus!
		</p>
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur exercitationem deserunt
			perspiciatis, debitis ea iure tempora assumenda dicta delectus consequuntur eaque, nemo quia
			ab doloremque, quidem fugit optio esse temporibus!
		</p>
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur exercitationem deserunt
			perspiciatis, debitis ea iure tempora assumenda dicta delectus consequuntur eaque, nemo quia
			ab doloremque, quidem fugit optio esse temporibus!
		</p>
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur exercitationem deserunt
			perspiciatis, debitis ea iure tempora assumenda dicta delectus consequuntur eaque, nemo quia
			ab doloremque, quidem fugit optio esse temporibus! Lorem ipsum dolor sit amet consectetur
			adipisicing elit. Consequatur exercitationem deserunt perspiciatis, debitis ea iure tempora
			assumenda dicta delectus consequuntur eaque, nemo quia ab doloremque, quidem fugit optio esse
			temporibus! Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
			exercitationem deserunt perspiciatis, debitis ea iure tempora assumenda dicta delectus
			consequuntur eaque, nemo quia ab doloremque, quidem fugit optio esse temporibus! Lorem ipsum
			dolor sit amet consectetur adipisicing elit. Consequatur exercitationem deserunt perspiciatis,
			debitis ea iure tempora assumenda dicta delectus consequuntur eaque, nemo quia ab doloremque,
			quidem fugit optio esse temporibus! Lorem ipsum dolor sit amet consectetur adipisicing elit.
			Consequatur exercitationem deserunt perspiciatis, debitis ea iure tempora assumenda dicta
			delectus consequuntur eaque, nemo quia ab doloremque, quidem fugit optio esse temporibus!
		</p>
	</Container>
</HeroPage>

<style>
	p {
		margin-bottom: 1rem;
		max-width: 70ch;
	}
</style>
