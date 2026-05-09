<script lang="ts">
	import { difficultyClassMap, difficultyMap, type Lobby } from '$lib';
	import { fly } from 'svelte/transition';
	import StageIcon from './start-icon.svelte';
	import CharacterIcon from './character-icon.svelte';
	import { flip } from 'svelte/animate';
	import { tracking } from '$lib/util.svelte';

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
	<p class="subtitle has-text-centered">Lobbies ({lobbies.length})</p>
	<div class="lobby-list">
		{#each lobbies as lobby (lobby.id)}
			<div
				class={[
					'lobby-card card px-4 py-3 has-background-primary-soft',
					difficultyClassMap[lobby.difficulty],
					tracking.trackingNames.includes(lobby.name) && 'tracked'
				]}
				transition:fly={{ duration: 200, x: 20 }}
				animate:flip={{ duration: 200 }}
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
						>({lobby.member_num > lobby.player_num ? lobby.member_num - lobby.player_num : 0})</span
					>
				</div>
				<div class="columns is-mobile is-flex-grow-1 is-align-items-center">
					<div class="column is-4 breakable lobby-name">{lobby.name}</div>
					<div class="column breakable">{lobby.desc}</div>
				</div>
			</div>
			<!-- {:else} -->
			<!-- 	<div class="content py-4 has-text-centered has-text-primary has-text-weight-light"> -->
			<!-- 		<p class="title is-4">No lobbies found...</p> -->
			<!-- 		<p class="subtitle is-5">The night calms</p> -->
			<!-- 	</div> -->
		{/each}
	</div>
</div>

<style>
	.lobby-listing {
		padding-block: 1.25rem;
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
</style>
