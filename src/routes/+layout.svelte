<script lang="ts">
	import '../app.css';
	import DiscordIcon from '$lib/assets/Discord Logo.svelte';
	import ThemeToggle from './theme-toggle.svelte';
	import ToastManager from '$lib/ToastManager.svelte.svelte';
	import Background from './background.svelte';
	import GearIcon from '$lib/assets/gear.svelte';
	import Modal from './modal.svelte';
	import { appSettings } from '$lib/util.svelte';
	import { GITHUB_REPO_URL } from '$lib';
	import { dev } from '$app/environment';

	let { children } = $props();

	let navbarBurgerActive = $state(false);

	let settingsModalActive = $state(false);
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

<Background />

<Modal bind:active={settingsModalActive}>
	{#snippet header()}
		<p class="card-header-title">R&amp;S Party Finder Settings</p>
	{/snippet}
	{#snippet children()}
		<div class="field">
			<label class="checkbox"
				><input type="checkbox" bind:checked={appSettings.current.animateBackground} /> Animate background</label
			>
			<p class="is-size-7">
				The animated background may cause performance issues on lower end computers.
			</p>
		</div>
	{/snippet}
</Modal>

<header>
	<nav class="navbar has-background-primary-soft">
		<div class="container">
			<div class="navbar-brand">
				<a href="/" class="navbar-item is-size-4 has-text-weight-semibold">R&amp;S Partyfinder</a>
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
				<div class="navbar-item is-flex is-align-items-center is-justify-content-center">
					<div class="is-size-6 has-text-weight-medium is-hidden-desktop">Settings</div>
					<span class="is-size-4 is-flex"
						><button class="icon has-larger-click-area" onclick={() => (settingsModalActive = true)}
							><GearIcon />
						</button></span
					>
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
				<a href={GITHUB_REPO_URL} target="_blank">Source Code</a>
			</li>
		</ul>
		<ul>
			<li>
				<strong class="has-text-weight-normal">Rabbit &amp; Steel</strong> is &copy;
				<strong class="has-text-weight-normal">mino_dev</strong>
			</li>
			<li>This project is unaffiliated with Rabbit & Steel's creators/distributors</li>
		</ul>
		<ul class="is-size-7 pt-3">
			<li>
				{dev ? 'DEV' : 'PROD'} &ndash; commit
				<a href={`${GITHUB_REPO_URL}/commit/${__GIT_HASH__}`}
					><code class="is-underlined-hover">{__GIT_HASH__}</code></a
				>
				written <code>{__BUILD_DATE__}</code>
			</li>
		</ul>
	</div>
</footer>

<ToastManager />

<style>
	.navbar-menu {
		overflow: hidden;
		transition:
			height 300ms ease-out,
			padding 300ms ease-out,
			display 300ms ease-out allow-discrete;
		interpolate-size: allow-keywords;

		&.is-active {
			height: auto;
			padding: 0.5rem 0;
			animation: scale-in 300ms ease-out;
		}
	}
	@media screen and (max-width: 1023px) {
		.navbar-menu {
			height: 0;
			padding-block: 0;
		}
	}

	@keyframes scale-in {
		from {
			height: 0;
			padding-block: 0;
		}
		to {
			height: auto;
		}
	}

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
		--bulma-footer-padding: 2rem 1.5rem 1.5rem;
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
