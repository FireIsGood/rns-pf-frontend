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

	<title>R&amp;S Party Finder</title>
	<meta name="name" content="R&S Party Finder" />
	<meta name="description" content="Look up R&S open lobbies from the browser." />
</svelte:head>

<header>
	<nav class="navbar has-background-primary-soft">
		<div class="container">
			<div class="navbar-brand">
				<a href="/" class="navbar-item title">R&amp;S Partyfinder</a>
			</div>
			<div class="navbar-end">
				<span class="navbar-item"
					><a
						href="https://discord.com/invite/mns"
						target="_blank"
						class="button is-info is-soft discord-link"><DiscordIcon /> mino_dev Discord</a
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
<div class="looping-squares">
	{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as index}
		<div class="square" style={`--offset-base: ${index}`}></div>
	{/each}
</div>

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

	.looping-squares {
		position: absolute;
		inset: 0;
		overflow: clip;
		z-index: -1;
	}

	.square {
		--offset: calc(var(--offset-base));
		--size: calc(240px * var(--offset));
		--square-color: hsl(
			var(--bulma-primary-h) calc(var(--bulma-primary-s) - 10%)
				calc(var(--bulma-soft-l) + 15% * sign(var(--bulma-active-border-l-delta)))
		);
		--square-shadow-color: hsl(
			var(--bulma-primary-h) calc(var(--bulma-primary-s) - 10%)
				calc(var(--bulma-soft-l) + 50% * sign(var(--bulma-active-border-l-delta))) / 0.25
		);

		width: var(--size);
		height: var(--size);
		border: 4px solid var(--square-color);
		opacity: min(calc(0.125 * (var(--offset) - 0.5)), 0.25);

		position: absolute;
		translate: 25% -45%;
		right: 30%;
		top: 45%;
		z-index: 100;

		--initial-rotation: 0.08turn;
		rotate: var(--initial-rotation);
		box-shadow:
			0 0 12px -1px var(--square-shadow-color),
			0 0 12px -1px var(--square-shadow-color) inset;

		animation:
			spin 40s linear infinite,
			zoom 12s linear infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.square {
			animation: unset;
		}
	}

	@keyframes spin {
		from {
			rotate: var(--initial-rotation);
		}
		to {
			rotate: calc(var(--initial-rotation) - 0.25turn);
		}
	}

	@keyframes zoom {
		from {
			--offset: calc(var(--offset-base));
		}
		to {
			--offset: calc(var(--offset-base) + 1);
		}
	}

	@property --offset {
		syntax: '<number>';
		initial-value: 0;
		inherits: false;
	}
</style>
