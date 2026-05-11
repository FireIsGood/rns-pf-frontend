<script lang="ts">
	import { difficultyClassMap, difficultyMap } from '$lib';
	import { appSettings, appState, lobbyFilters, pickRandom, ServerStatus } from '$lib/util.svelte';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { typewriter } from '$lib/util.svelte';
	import StageIcon from './start-icon.svelte';
	import CharacterIcon from './character-icon.svelte';
	import CopyButton from './copy-button.svelte';
	import sayaImage from '$lib/assets/saya_shop.gif';
	import spellManifestImage from '$lib/assets/spell_manifest.gif';
	import { onMount } from 'svelte';
	import FilterTags from './filter-tags.svelte';

	let trackingNames = appSettings.current.trackingNames;

	// Spell Manifest
	let spellManifestQuoteList = [
		// From voice lines as an enemy and dialog
		'Terribly lonely....',
		'Are you... alone...?',
		"You're alone....",
		'Terribly, terribly lonely.....',
		"You're alone... you're alone...?",
		"...But don't you know....?",
		"That's... That's too sad....!",
		'Rabbits.... lonely rabbits.... they....',
		'Where are your friends...?',
		'Terribly lonely.... everyone.....',
		'You need friends...!'
	];
	let spellManifestQuote = $state<string>();

	// Saya
	let sayaQuoteList = [
		// From voice lines as enemy and shopkeeper
		'...Hm...',
		'Well, well...',
		'Hello.',
		'Another puzzle.',
		'Can your mind grasp these insights?',
		'Onto the next lesson.'
	];
	let sayaQuote = $state<string>();

	let debouncedHydrationComplete: boolean = $state(false);
	onMount(() => {
		spellManifestQuote = pickRandom(spellManifestQuoteList);
		sayaQuote = pickRandom(sayaQuoteList);
	});

	$effect(() => {
		if (appState.serverStatus === ServerStatus.CONNECTED) {
			setTimeout(() => {
				debouncedHydrationComplete = true;
			}, 200);
		}
	});

	let lastLobbyCount = $state(0);
	$effect(() => {
		if (appState.lobbies.length !== lastLobbyCount) {
			spellManifestQuote = pickRandom(spellManifestQuoteList);
			sayaQuote = pickRandom(sayaQuoteList);
		}
		lastLobbyCount = appState.lobbies.length;
	});
</script>

{#snippet characterIcon(character: number | null, palette: number | null)}
	{#if character !== null}
		<CharacterIcon {character} palette={palette ?? 0} class="image is-1by1 is-32x32" />
	{:else}
		<div class="empty-character image is-1by1 is-32x32"></div>
	{/if}
{/snippet}

<div class="lobby-listing">
	<p class="lobby-title title is-4 has-text-centered">
		<span class="lobby-title-text">Lobbies</span>
		<span class="lobby-title-count has-text-weight-medium"
			><span>&middot;</span>
			<span
				>{appState.lobbiesFiltered
					.length}{#if appState.lobbiesFiltered.length !== appState.lobbies.length}/{appState
						.lobbies.length}{/if}</span
			></span
		>
	</p>
	<FilterTags />
	<div class="overlap-children">
		{#if debouncedHydrationComplete && appState.lobbiesFiltered.length === 0}
			<div class="overlap-children" transition:fly={{ duration: 400, x: -10 }}>
				{#if appState.lobbies.length === 0}
					<div class="py-4" transition:fly={{ duration: 600, x: 10 }}>
						<div class="dialog-root" style="--character-color: #ff3651">
							<div class="dialog-content">
								<div class="character-stack overlap-children mx-auto mt-6 mb-4">
									<div class="flight-ring-root">
										<div class="flight-ring"></div>
									</div>
									<img src={spellManifestImage} alt="" class="image spell-manifest-image is-1by1" />
								</div>
								<div class="has-text-centered has-text-weight-medium">
									<p class="pb-1">No lobbies found</p>
								</div>
							</div>
							{#if spellManifestQuote}
								<div class="dialog-box" in:fade|global={{ duration: 200, delay: 200 }}>
									<div class="dialog-text" in:typewriter|global={{ speed: 3 }}>
										{spellManifestQuote}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{:else}
					<div class="py-4" transition:fly={{ duration: 600, x: -10 }}>
						<div class="dialog-root" style="--character-color: #6d55ff">
							<div class="dialog-content">
								<div class="character-stack overlap-children mx-auto mt-6 mb-4">
									<div class="flight-ring-root">
										<div class="flight-ring"></div>
									</div>
									<img src={sayaImage} alt="" class="image saya-image is-1by1" />
								</div>
								<div class="content has-text-centered has-text-weight-medium">
									<p>No lobbies matched all filters</p>
									<button
										class="button is-primary is-outlined"
										onclick={() => {
											lobbyFilters.reset();
										}}>Reset filters</button
									>
								</div>
							</div>
							{#if sayaQuote}
								<div class="dialog-box" in:fade|global={{ duration: 200, delay: 200 }}>
									<div class="dialog-text" in:typewriter|global={{ speed: 3 }}>
										{sayaQuote}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/if}
		<div class="lobby-list">
			{#each appState.lobbiesFiltered as lobby (lobby.id)}
				<div
					class={[
						'lobby-card is-shadowless card px-4 py-3 has-background-primary-soft',
						difficultyClassMap[lobby.difficulty],
						trackingNames.includes(lobby.name) && 'tracked'
					]}
					transition:fly={{ duration: 400, x: 20 }}
					animate:flip={{ duration: 400 }}
				>
					{#if trackingNames.includes(lobby.name) && 'tracked'}
						<div class="lobby-card-glow" transition:fade={{ duration: 200 }}></div>
						<div class="lobby-card-overlay" transition:fade={{ duration: 200 }}></div>
					{/if}
					<div class="lobby-card-main">
						<StageIcon {lobby} />
						<div class="lobby-difficulty is-size-5 has-text-primary has-text-weight-semibold">
							{difficultyMap[lobby.difficulty]}
						</div>
						<div class="player-list">
							{@render characterIcon(lobby.char0, lobby.palette0)}
							{#if lobby.max_players >= 2}
								{@render characterIcon(lobby.char1, lobby.palette1)}
							{/if}
							{#if lobby.max_players >= 3}
								{@render characterIcon(lobby.char2, lobby.palette2)}
							{/if}
							{#if lobby.max_players >= 4}
								{@render characterIcon(lobby.char3, lobby.palette3)}
							{/if}
							<span class="player-spectator-count is-size-7"
								>({lobby.member_num > lobby.player_num
									? lobby.member_num - lobby.player_num
									: 0})</span
							>
						</div>
					</div>
					<div class="lobby-card-text">
						<div class="lobby-name breakable">
							<div class="lobby-text-label is-size-7 has-text-weight-medium">name</div>
							<p class="lobby-name-text">{lobby.name}</p>
						</div>
						<div class="lobby-description breakable">
							<div class="lobby-text-label is-size-7 has-text-weight-medium">description</div>
							<p class="lobby-description-text">
								{lobby.desc}
							</p>
							<CopyButton text={lobby.desc} />
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.lobby-listing {
		padding-block: 1rem;
	}

	@media (max-width: 1024px) {
		.lobby-listing {
			padding-block: 1rem 4rem;
		}
	}

	@media (min-width: 1023px) {
		.lobby-title {
			display: grid;
			grid-template-columns: 1fr auto 1fr;
			grid-template-areas: '. text count';
			gap: 0.25em;

			.lobby-title-text {
				grid-area: text;
			}
			.lobby-title-count {
				grid-area: count;
				justify-self: flex-start;
				display: grid;
				grid-template-columns: auto auto;
				gap: 0.25em;
			}
		}
	}

	.lobby-card-glow {
		pointer-events: none;
		position: absolute;
		inset: -2px;

		&::before,
		&::after {
			pointer-events: none;
			content: '';
			border: 1px solid var(--card-color);
			position: absolute;
			inset: 0;
			border-radius: calc(var(--bulma-card-radius) * 1.125);
		}
		&::before {
			opacity: 0.5;
			filter: blur(1px);
		}
		&::after {
			opacity: 0.5;
			filter: blur(4px);
		}
	}

	.lobby-card-overlay {
		pointer-events: none;
		position: absolute;
		inset: -2px;

		&::before,
		&::after {
			pointer-events: none;
			content: '';
			position: absolute;
			inset: 0;
			border-radius: calc(var(--bulma-card-radius) * 1.25);
			background-image: linear-gradient(
				to bottom right,
				var(--card-color),
				rgb(from var(--card-color) r g b / 0.1) 1.5rem,
				rgb(from var(--card-color) r g b / 0.15) calc(100% - 1.5rem),
				var(--card-color)
			);
		}
		&::before {
			opacity: 0.6;
			filter: blur(2px);
		}
		&::after {
			inset: -4px;
			opacity: 0.8;
			filter: blur(8px);
		}
	}

	.lobby-list {
		height: max-content;
		container: lobby-card / inline-size;
	}

	.lobby-card {
		--bulma-primary-h: var(--difficulty-h);
		--card-color: hsl(
			var(--bulma-primary-h),
			calc(var(--bulma-primary-s) + 50%),
			calc(var(--bulma-primary-l) + 24%)
		);
		--border-color: hsl(
			var(--bulma-primary-h),
			var(--bulma-scheme-s),
			calc(var(--bulma-scheme-main-l) + var(--bulma-active-border-l-delta))
		);

		display: grid;
		gap: 1.5rem 1rem;
		grid-template-columns: auto 1fr;
		padding: 1rem 1.25rem;
		border: 1px solid;
		border-color: var(--border-color);
	}

	.lobby-card-main {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		grid-template-columns: 4rem 8rem 1fr 1fr 1fr;
	}

	.lobby-card-text {
		position: relative;
		display: grid;
		grid-template-columns: 4fr 8fr;
		align-items: center;
	}

	.lobby-text-label {
		position: absolute;
		top: -0.75rem;
		opacity: 0.2;
		user-select: none;
	}

	.lobby-name {
		max-width: 16ch;
	}

	.lobby-description {
		display: grid;
		column-gap: 0.5rem;
		grid-template-areas: 'text copy';
		align-items: center;
		position: relative;

		.lobby-text-label,
		.lobby-description-text {
			grid-area: text;
		}
	}

	.lobby-name-text,
	.lobby-description-text {
		overflow: hidden;
		width: 100%;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	@container lobby-card (width < 600px) {
		.lobby-card {
			grid-template-columns: 1fr;
		}
		.lobby-text-label {
			top: -0.75rem;
		}
	}

	.lobby-difficulty {
		min-width: 5.5ch;
	}

	.cute {
		--difficulty-h: 206;
	}

	.normal {
		--difficulty-h: 44;
	}

	.hard {
		--difficulty-h: 352;
	}

	.lunar {
		--difficulty-h: 264;
	}

	.player-list {
		display: grid;
		grid-template-columns: repeat(4, 1fr) 3ch;
		align-items: center;
	}

	.player-spectator-count {
		margin-left: 0.25rem;
	}

	.empty-character {
		display: grid;
		place-items: center;
		&::after {
			content: '';
			display: block;
			width: 28px;
			height: 28px;
			background-color: hsl(
				var(--bulma-primary-h) var(--bulma-scheme-s) calc(var(--bulma-scheme-main-l) - 20%) / 0.75
			);

			border-radius: 100%;
		}
	}

	.breakable {
		word-break: break-word;
	}

	.overlap-children {
		display: grid;

		> * {
			grid-area: 1 / -1;
		}
	}

	.character-stack {
		place-items: center;
		width: fit-content;
		user-select: none;
		pointer-events: none;
		height: 200px;
	}

	.saya-image {
		width: 200px;
		scale: -1 1;
		translate: -4px -20px;
	}

	.spell-manifest-image {
		width: 165px;
		scale: -1 1;
		translate: -0px -2px;
	}

	.flight-ring-root {
		width: 200px;
		height: 200px;
		position: absolute;
		display: grid;
		place-items: center;
	}

	.flight-ring {
		height: 170px;
		width: 170px;
		background-color: color-mix(in srgb, var(--character-color) 100%, #fff 50%);
		background-blend-mode: screen;
		opacity: 0.5;
		animation: spin 10000ms linear infinite;
		mask: url('$lib/assets/flight_ring.png') 0 0 / 100% 100%;
	}

	@keyframes spin {
		0% {
			rotate: 0;
		}
		100% {
			rotate: 1turn;
		}
	}

	.dialog-root {
		anchor-scope: all;
	}

	.dialog-content {
		anchor-name: --dialog;
		position: relative;
	}

	.dialog-box {
		--dialog-background: var(--bulma-scheme-main-ter);
		--dialog-border: color-mix(
			in srgb,
			var(--character-color) 100%,
			var(--bulma-scheme-main-ter) 50%
		);
		position: absolute;
		position-anchor: --dialog;
		position-area: top;
		background-color: var(--dialog-background);
		border: 2px solid var(--dialog-border);
		border-radius: 8px;
		font-weight: 500;
		padding: 0.5rem 0.75rem;
		text-align: center;
		min-height: 2.5rem;
		min-width: 2.5rem;
		max-width: 32ch;

		&::before {
			content: '';
			position: absolute;
			left: 50%;
			bottom: -12px;
			width: 24px;
			height: 24px;
			background-color: var(--dialog-background);
			margin-left: -12px;
			box-shadow: 2px 2px 0px var(--dialog-border);
			transform: rotate(45deg);
			border-width: 0;
			animation: dialog-line-in 200ms 100ms linear forwards;
		}
	}

	.dialog-text {
		position: relative;
		z-index: 1;
	}

	@keyframes dialog-line-in {
		from {
			scale: 0.5 0;
		}
		to {
			scale: 0.5 1;
		}
	}
</style>
