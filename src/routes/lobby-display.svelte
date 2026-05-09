<script lang="ts">
	import { difficultyClassMap, difficultyMap, type Lobby } from '$lib';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { tracking } from '$lib/util.svelte';
	import StageIcon from './start-icon.svelte';
	import CharacterIcon from './character-icon.svelte';
	import sayaImage from '$lib/assets/saya_shop.gif';

	let { lobbies }: { lobbies: Lobby[] } = $props();
</script>

{#snippet characterIcon(character: number | null, palette: number | null)}
	{#if character !== null}
		<CharacterIcon {character} palette={palette ?? 0} class="image is-1by1 is-32x32" />
	{:else}
		<div class="empty-character image is-1by1 is-32x32"></div>
	{/if}
{/snippet}

<div class="lobby-listing">
	<p class="title is-4 has-text-centered">Lobbies ({lobbies.length})</p>
	<div class="overlap-children">
		{#if lobbies.length === 0}
			<div class="py-4" transition:fly={{ duration: 400, y: 5 }}>
				<div class="saya-stack overlap-children mx-auto mt-6 mb-4">
					<div class="flight-ring-root">
						<div class="flight-ring"></div>
					</div>
					<img src={sayaImage} alt="" class="image saya-image is-1by1" />
				</div>
				<p class="has-text-centered has-text-weight-medium">No lobbies found</p>
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
				var(--bulma-info-s),
				calc(var(--bulma-soft-l) + var(--bulma-hover-border-l-delta))
			);
			content: '';
			position: absolute;
			top: -1px;
			right: 1rem;
			width: 1.25rem;
			border-left: 0.625rem solid var(--bookmark-color);
			border-right: 0.625rem solid var(--bookmark-color);
			border-bottom: 0.625rem solid transparent;
			height: 2rem;

			translate: 0 -100%;
			transition: translate 100ms;
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

	.saya-stack {
		width: fit-content;
		--character-color: #6d55ff;
	}

	.saya-image {
		width: 200px;
		scale: -1 1;
		translate: -4px 0px;
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
		translate: 0 20px;
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
</style>
