<script lang="ts">
	import '../app.css';
	import DiscordIcon from '$lib/assets/Discord Logo.svelte';
	import ThemeToggle from './theme-toggle.svelte';
	import ToastManager from '$lib/ToastManager.svelte.svelte';

	let { children } = $props();

	let navbarBurgerActive = $state(false);
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
				<a href="/" class="navbar-item">R&amp;S Partyfinder</a>
				<!-- svelte-ignore a11y_missing_attribute -->
				<a
					role="button"
					class="navbar-burger"
					class:is-active={navbarBurgerActive}
					aria-label="menu"
					aria-expanded={navbarBurgerActive}
					tabindex="0"
					onclick={() => (navbarBurgerActive = !navbarBurgerActive)}
					onkeydown={(e) => {
						if (e.key === 'Enter') navbarBurgerActive = !navbarBurgerActive;
					}}
				>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>
			<div class="navbar-menu" class:is-active={navbarBurgerActive}>
				<span class="navbar-item ml-auto is-flex is-justify-content-center"
					><a
						href="https://discord.com/invite/mns"
						target="_blank"
						class="discord-link button is-info is-soft is-flex-grow-1"
						><DiscordIcon /> mino_dev Discord</a
					></span
				>
				<div class="navbar-item is-flex is-align-items-center is-justify-content-center">
					<div class="is-size-6 has-text-weight-medium is-hidden-desktop">Toggle theme</div>
					<span class="is-size-4 is-flex"><ThemeToggle /></span>
				</div>
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
			<li>
				<a href="https://github.com/FireIsGood/rns-pf-frontend" target="_blank">Source Code</a>
			</li>
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

<ToastManager />

<style>
	.discord-link {
		--bulma-button-h: var(--discord-h);
		--bulma-button-s: var(--discord-s);
		--bulma-button-v: var(--discord-v);

		display: inline-flex;
		gap: 0.5em;
		border: 1px solid;
		border-color: hsl(
			var(--bulma-button-h),
			var(--bulma-button-s),
			calc(var(--bulma-scheme-main-l) + var(--bulma-active-border-l-delta))
		);
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
		position: fixed;
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

		animation: zoom 24s linear infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.square {
			animation: unset;
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
