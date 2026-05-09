<script lang="ts">
	import { difficultyClassMap, difficultyMap, pickRandom, type Lobby } from '$lib';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { tracking, typewriter } from '$lib/util.svelte';
	import StageIcon from './start-icon.svelte';
	import CharacterIcon from './character-icon.svelte';
	import sayaImage from '$lib/assets/saya_shop.gif';
	import spellManifestImage from '$lib/assets/spell_manifest.gif';
	import { onMount } from 'svelte';

	let { lobbies, totalLobbies }: { lobbies: Lobby[]; totalLobbies: number } = $props();

	// Spell Manifest
	let spellManifestQuoteList = [
		// From voice lines as an enemy and dialog
		'Terrbily lonely....',
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

	let lastLobbyCount = $state(0);
	onMount(() => {
		spellManifestQuote = pickRandom(spellManifestQuoteList);
		sayaQuote = pickRandom(sayaQuoteList);
	});

	$effect(() => {
		if (lobbies.length !== lastLobbyCount) {
			spellManifestQuote = pickRandom(spellManifestQuoteList);
			sayaQuote = pickRandom(sayaQuoteList);
		}
		lastLobbyCount = lobbies.length;
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
	<p class="title is-4 has-text-centered">
		Lobbies ({lobbies.length}{#if lobbies.length !== totalLobbies}/{totalLobbies}{/if})
	</p>
	<div class="overlap-children">
		{#if lobbies.length === 0}
			<div class="overlap-children" transition:fly={{ duration: 400 }}>
				{#if totalLobbies === 0}
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
								<div class="dialog-box" in:fade|global={{ duration: 200 }}>
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
								<div class="has-text-centered has-text-weight-medium">
									<p class="pb-1">No lobbies matched all filters</p>
								</div>
							</div>
							{#if sayaQuote}
								<div class="dialog-box" in:fade|global={{ duration: 200 }}>
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
			{#each lobbies as lobby (lobby.id)}
				<div
					class={[
						'lobby-card card px-4 py-3 has-background-primary-soft',
						difficultyClassMap[lobby.difficulty],
						tracking.trackingNames.includes(lobby.name) && 'tracked'
					]}
					transition:fly={{ duration: 400, x: 20 }}
					animate:flip={{ duration: 400 }}
				>
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
					<div class="columns is-mobile is-flex-grow-1 is-align-items-center">
						<div class="column is-4 breakable lobby-name">{lobby.name}</div>
						<div class="column breakable">{lobby.desc}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.lobby-listing {
		padding-top: 1.25rem;
	}

	.lobby-list {
		height: max-content;
	}

	.lobby-card {
		--bulma-primary-h: var(--difficulty-h);

		padding: 1rem 1.25rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		grid-template-columns: 4rem 8rem 1fr 1fr 1fr;
		border: 1px solid;
		border-color: hsl(
			var(--bulma-primary-h),
			var(--bulma-scheme-s),
			calc(var(--bulma-scheme-main-l) + var(--bulma-active-border-l-delta))
		);
		line-height: 1.25;
		overflow: clip;

		&::after {
			--bookmark-color: hsl(
				var(--bulma-info-h),
				40%,
				calc(var(--bulma-scheme-main-l) + var(--bulma-active-border-l-delta))
			);

			--width: 0.6rem;

			content: '';
			position: absolute;
			top: 0;
			right: 0.75rem;
			border-left: var(--width) solid var(--bookmark-color);
			border-right: var(--width) solid var(--bookmark-color);
			border-bottom: var(--width) solid transparent;
			height: 1.5rem;

			translate: 0 -100%;
			transition: translate 400ms;
		}

		&.tracked {
			&::after {
				translate: 0;
			}
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

	.lobby-name {
		max-width: 16ch;
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
		--dialog-background: rgb(from var(--bulma-scheme-main-ter) r g b);
		--dialog-border: color-mix(in srgb, var(--character-color) 100%, #000 50%);
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
			scale: 0.5 0;
			animation: dialog-line-in 200ms 100ms forwards;
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
