<script lang="ts">
	import { areaMap, difficultyMap, type AreaName, type Difficulty, type Lobby } from '$lib';
	import { onMount } from 'svelte';
	import AreaIcon from './area-icon.svelte';
	import LobbyDisplay from './lobby-display.svelte';
	import Notifications from './notifications.svelte';
	import lockIcon from '$lib/assets/Lock Icon.png';
	import unlockIcon from '$lib/assets/Unlock Icon.png';
	import modIcon from '$lib/assets/Mod Icon.png';
	import noModIcon from '$lib/assets/No Mod Icon.png';
	import unknownIcon from '$lib/assets/Unknown Icon.png';
	import cuteIcon from '$lib/assets/difficulties/Cute.png';
	import normalIcon from '$lib/assets/difficulties/Normal.png';
	import hardIcon from '$lib/assets/difficulties/Hard.png';
	import lunarIcon from '$lib/assets/difficulties/Lunar.png';
	import XIcon from '$lib/assets/x.svelte';
	import GearIcon from '$lib/assets/gear.svelte';
	import { connectStream } from '$lib/stream-api';

	onMount(async () => {
		initializeLobbies();
	});

	async function initializeLobbies() {
		return await connectStream((chunk) => {
			const shouldNotify = chunk.id !== 1;
			if (shouldNotify) {
				const currentIds = new Set(lobbies.map((l) => l.id));
				const updatedIds = new Set(chunk.data.map((l) => l.id));
				const diffIds = updatedIds.difference(currentIds);
				const diffLobbies = chunk.data.filter((l) => diffIds.has(l.id));

				newLobbies = diffLobbies;
			}

			lobbies = chunk.data;
		});
	}

	let lobbies: Lobby[] = $state([]);
	let newLobbies: Lobby[] = $state([]);

	const allAreas: AreaName[] = [
		'Random',
		'ScholarsNest',
		'KingsArsenal',
		'RedDarkhouse',
		'ChurchmouseStreets',
		'EmeraldLakeside',
		'DarkhouseDepths',
		'SubterraSanctum',
		'AtelierAurum',
		'ExRandom',
		'TrueRandom',
		'ChaoticRandom',
		'Toybox'
	];

	const allDifficulties: Difficulty[] = ['Cute', 'Normal', 'Hard', 'Lunar'];
	const difficultyIconMap: Record<Difficulty, string> = {
		Cute: cuteIcon,
		Normal: normalIcon,
		Hard: hardIcon,
		Lunar: lunarIcon
	};

	let destinationFilter: AreaName | 'Any' = $state('Any');
	let difficultyFilter: Difficulty | 'Any' = $state('Any');
	let passwordFilter: boolean | 'Any' = $state('Any');
	let modFilter: boolean | 'Any' = $state('Any');
	let modClientShow: boolean = $state(false);

	let lobbiesFiltered = $derived(
		lobbies
			.filter(
				(l) =>
					(destinationFilter === 'Any' || destinationFilter === areaMap[l.stage_first]) &&
					(difficultyFilter === 'Any' || difficultyFilter === difficultyMap[l.difficulty]) &&
					(passwordFilter === 'Any' || passwordFilter === l.password_locked) &&
					(modFilter === 'Any' || modFilter === l.modded) &&
					(modClientShow === true || !isClientModified(l.online_version))
			)
			.toSorted(
				(l1, l2) =>
					(l2.difficulty - l1.difficulty) * 1000 + // Higher difficulty > Lower difficulty
					(+l1.password_locked - +l2.password_locked) * 100 + // No password > Password
					(+l1.modded - +l2.modded) * 10 + // No mod > Mod
					(+(+l2.id < +l1.id) * 2 - 1) // Lower ID > Higher ID
			)
	);

	function isClientModified(version: number): boolean {
		const online_v1 = 300 <= version && version < 500;
		const online_v2 = 500 <= version && version < 600;
		return !(online_v1 || online_v2);
	}

	let filterModalActive = $state(false);
</script>

{#snippet filterButton(iconSrc: string, highlighted: boolean, callback: () => void)}
	<button class="button p-1 is-flex-grow-1" class:highlighted onclick={callback}
		><img src={iconSrc} alt="" class="image is-1by1 is-24x24" /></button
	>
{/snippet}

<section class="container section columns">
	<div class="sidebar-options column is-narrow">
		<div class="card">
			<header class="card-header">
				<p class="card-header-title">Filter Lobbies</p>
				<button
					class="button card-header-icon is-size-5"
					aria-label="collapse"
					onclick={() => (filterModalActive = true)}
				>
					<GearIcon />
				</button>
			</header>
			<div class="card-content">
				<div class="mb-1 has-text-centered is-size-7">Destination</div>
				<fieldset class="filter-group" style="--group-count: 14">
					<button
						class="button py-1 px-0 is-flex-grow-1"
						class:highlighted={destinationFilter === 'Any'}
						onclick={() => {
							destinationFilter = 'Any';
						}}
					>
						<AreaIcon area="Unknown" class="image is-1by1 is-24x24" /></button
					>
					{#each allAreas as destination}
						<button
							class="button py-1 px-0 is-flex-grow-1"
							class:highlighted={destinationFilter === destination}
							onclick={() => {
								destinationFilter = destination;
							}}
						>
							<AreaIcon area={destination} class="image is-1by1 is-24x24" /></button
						>
					{/each}
				</fieldset>
				<div class="mb-1 has-text-centered is-size-7">Difficulty</div>
				<fieldset class="filter-group">
					{@render filterButton(unknownIcon, difficultyFilter === 'Any', () => {
						difficultyFilter = 'Any';
					})}
					{#each allDifficulties as difficulty}
						{@render filterButton(
							difficultyIconMap[difficulty],
							difficultyFilter === difficulty,
							() => {
								difficultyFilter = difficulty;
							}
						)}
					{/each}
				</fieldset>
				<div class="mb-1 has-text-centered is-size-7">Password Locked</div>
				<fieldset class="filter-group">
					{@render filterButton(unknownIcon, passwordFilter === 'Any', () => {
						passwordFilter = 'Any';
					})}
					{@render filterButton(lockIcon, passwordFilter === true, () => {
						passwordFilter = true;
					})}
					{@render filterButton(unlockIcon, passwordFilter === false, () => {
						passwordFilter = false;
					})}
				</fieldset>
				<div class="mb-1 has-text-centered is-size-7">Using Mods</div>
				<fieldset class="filter-group">
					{@render filterButton(unknownIcon, modFilter === 'Any', () => {
						modFilter = 'Any';
					})}
					{@render filterButton(modIcon, modFilter === true, () => {
						modFilter = true;
					})}
					{@render filterButton(noModIcon, modFilter === false, () => {
						modFilter = false;
					})}
				</fieldset>
			</div>
		</div>
		<Notifications {newLobbies} />
	</div>
	<div class="column">
		<LobbyDisplay lobbies={lobbiesFiltered} />
	</div>
</section>

<div class="modal" class:is-active={filterModalActive}>
	<div class="modal-background"></div>
	<div class="modal-content">
		<div class="card">
			<header class="card-header">
				<p class="card-header-title">Filter Options</p>
				<button
					class="button card-header-icon is-size-5"
					aria-label="close"
					onclick={() => (filterModalActive = false)}
				>
					<XIcon />
				</button>
			</header>
			<div class="card-content">
				<label class="checkbox pb-1"
					><input type="checkbox" bind:checked={modClientShow} /> Show modified clients</label
				>
				<p class="is-size-7">
					(Mostly <a href="https://github.com/NotNite/RNSReloaded" target="_blank">RnS Reloaded</a> or
					other steam versions/betas)
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	@media print, screen and (min-width: 769px) {
		.sidebar-options {
			max-width: 28rem;
		}
	}

	.filter-group {
		display: flex;
		flex-wrap: wrap;
		gap: 1px;
		&:not(:last-child) {
			margin-bottom: 0.75rem;
		}

		& > button:not(:first-child, :last-child) {
			border-radius: 0;
		}
		& > button:first-child {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		& > button:last-child {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
	}

	.highlighted {
		--bulma-button-background-l-delta: calc(40% * sign(var(--bulma-active-border-l-delta)));
	}
</style>
