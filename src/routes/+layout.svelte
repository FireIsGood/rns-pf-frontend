<script lang="ts">
	import '../app.css';
	import DiscordIcon from '$lib/assets/Discord Logo.svelte';
	import ThemeToggle from './theme-toggle.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<header>
	<nav class="navbar has-background-primary-soft">
		<div class="container">
			<div class="navbar-brand">
				<a href="/" class="navbar-item title">R&amp;S Partyfinder</a>
			</div>
			<div class="navbar-end">
				<span class="navbar-item"
					><a href="https://discord.com/invite/mns" class="button is-info is-soft discord-link"
						><DiscordIcon /> mino_dev Discord</a
					></span
				>
				<span class="navbar-item is-size-4 is-line-height-1"><ThemeToggle /></span>
			</div>
		</div>
	</nav>
</header>
<main>
	{@render children()}
</main>
<footer class="footer mt-auto has-text-centered">
	<div class="container footer-info">
		<ul>
			<li>
				<strong class="has-text-weight-normal">R&amp;S Partyfinder Website</strong> by
				<strong class="has-text-weight-normal">FireIsGood</strong>.
			</li>
			<li>
				<strong class="has-text-weight-normal">R&amp;S Partyfinder API</strong> by
				<strong class="has-text-weight-normal">Functional Lalafell</strong>.
			</li>
			<li><a href="/">Source Code</a></li>
		</ul>
		<ul>
			<li>
				<strong class="has-text-weight-normal">Rabbit &amp; Steel</strong> is &copy;
				<strong class="has-text-weight-normal">mino_dev</strong>
			</li>
			<li>This project is unaffiliated with Rabbit & Steel's creators/distributors</li>
		</ul>
	</div>
</footer>

<style>
	.discord-link {
		display: inline-flex;
		gap: 0.5em;
	}

	.footer {
		--bulma-footer-padding: 2rem 1.5rem 2.5rem;
	}

	footer ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.5rem;
		justify-content: center;
		padding: 0;
		list-style: none;

		& li {
			display: inline-block;
			padding: 0;

			&:not(:last-child)::after {
				content: '\00b7';
				padding-inline-start: 0.5rem;
			}
		}

		&:not(:last-child) {
			margin-bottom: 0.25rem;
		}
	}

	@media (width < 900px) {
		:root footer ul {
			display: block;
			padding-bottom: 1rem;
			padding-inline-start: 2ch;

			& li {
				display: list-item;
				line-height: 1.25;
				margin-bottom: 0.5rem;
			}
			& li::after {
				content: unset;
			}
		}
	}
</style>
