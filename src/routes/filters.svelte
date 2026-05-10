<script lang="ts" module>
	export type filterMessage = {
		type: 'resetAll';
	};
</script>

<script lang="ts">
	import { areaMap, difficultyMap, type AreaName, type Difficulty } from '$lib';
	import AreaIcon from './area-icon.svelte';
	import XIcon from '$lib/assets/x.svelte';
	import GearIcon from '$lib/assets/gear.svelte';
	import lockIcon from '$lib/assets/Lock Icon.png';
	import unlockIcon from '$lib/assets/Unlock Icon.png';
	import modIcon from '$lib/assets/Mod Icon.png';
	import noModIcon from '$lib/assets/No Mod Icon.png';
	import unknownIcon from '$lib/assets/Unknown Icon.png';
	import cuteIcon from '$lib/assets/difficulties/Cute.png';
	import normalIcon from '$lib/assets/difficulties/Normal.png';
	import hardIcon from '$lib/assets/difficulties/Hard.png';
	import lunarIcon from '$lib/assets/difficulties/Lunar.png';
	import { browser } from '$app/environment';
	import { appSettings, appState, lobbyFilters } from '$lib/util.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		function handleMessage(e: Event) {
			if (!(e instanceof CustomEvent)) return;
			const event: CustomEvent<filterMessage> = e;
			const eventType = event.detail.type;
			switch (eventType) {
				case 'resetAll':
					break;
			}
		}
		document.addEventListener('filterMessage', handleMessage);

		return () => {
			document.removeEventListener('filterMessage', handleMessage);
		};
	});

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

	$effect(() => {
		appState.lobbiesFiltered = appState.lobbies
			.filter(
				(l) =>
					(lobbyFilters.current.destination === 'Any' ||
						lobbyFilters.current.destination === areaMap[l.stage_first]) &&
					(lobbyFilters.current.difficulty === 'Any' ||
						lobbyFilters.current.difficulty === difficultyMap[l.difficulty]) &&
					(lobbyFilters.current.password === 'Any' ||
						lobbyFilters.current.password === l.password_locked) &&
					(lobbyFilters.current.mods === 'Any' || lobbyFilters.current.mods === l.modded) &&
					(appSettings.current.showClientMods === true || isClientVanilla(l.online_version))
			)
			.toSorted(
				(l1, l2) =>
					(l2.difficulty - l1.difficulty) * 1000 + // Higher difficulty > Lower difficulty
					(+l1.password_locked - +l2.password_locked) * 100 + // No password > Password
					(+l1.modded - +l2.modded) * 10 + // No mod > Mod
					(+(+l2.id < +l1.id) * 2 - 1) // Lower ID > Higher ID
			);
	});

	function isClientVanilla(version: number): boolean {
		const online_v1 = 300 <= version && version < 500;
		const online_v2 = 500 <= version && version < 600;
		return online_v1 || online_v2;
	}
	let filterModalActive = $state(false);
</script>

{#snippet filterButton(iconSrc: string, highlighted: boolean, callback: () => void)}
	<button class="button p-1 is-flex-grow-1" class:highlighted onclick={callback} disabled={!browser}
		><img src={iconSrc} alt="" class="image is-1by1 is-24x24" /></button
	>
{/snippet}

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
				class:highlighted={lobbyFilters.current.destination === 'Any'}
				onclick={() => {
					lobbyFilters.current.destination = 'Any';
				}}
				disabled={!browser}
			>
				<AreaIcon area="Unknown" class="image is-1by1 is-24x24" /></button
			>
			{#each allAreas as destination}
				<button
					class="button py-1 px-0 is-flex-grow-1"
					class:highlighted={lobbyFilters.current.destination === destination}
					onclick={() => {
						lobbyFilters.current.destination = destination;
					}}
					disabled={!browser}
				>
					<AreaIcon area={destination} class="image is-1by1 is-24x24" /></button
				>
			{/each}
		</fieldset>
		<div class="mb-1 has-text-centered is-size-7">Difficulty</div>
		<fieldset class="filter-group">
			{@render filterButton(unknownIcon, lobbyFilters.current.difficulty === 'Any', () => {
				lobbyFilters.current.difficulty = 'Any';
			})}
			{#each allDifficulties as difficulty}
				{@render filterButton(
					difficultyIconMap[difficulty],
					lobbyFilters.current.difficulty === difficulty,
					() => {
						lobbyFilters.current.difficulty = difficulty;
					}
				)}
			{/each}
		</fieldset>
		<div class="mb-1 has-text-centered is-size-7">Password Locked</div>
		<fieldset class="filter-group">
			{@render filterButton(unknownIcon, lobbyFilters.current.password === 'Any', () => {
				lobbyFilters.current.password = 'Any';
			})}
			{@render filterButton(lockIcon, lobbyFilters.current.password === true, () => {
				lobbyFilters.current.password = true;
			})}
			{@render filterButton(unlockIcon, lobbyFilters.current.password === false, () => {
				lobbyFilters.current.password = false;
			})}
		</fieldset>
		<div class="mb-1 has-text-centered is-size-7">Using Mods</div>
		<fieldset class="filter-group">
			{@render filterButton(unknownIcon, lobbyFilters.current.mods === 'Any', () => {
				lobbyFilters.current.mods = 'Any';
			})}
			{@render filterButton(modIcon, lobbyFilters.current.mods === true, () => {
				lobbyFilters.current.mods = true;
			})}
			{@render filterButton(noModIcon, lobbyFilters.current.mods === false, () => {
				lobbyFilters.current.mods = false;
			})}
		</fieldset>
	</div>
</div>

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
				<div class="field">
					<label class="checkbox pb-1"
						><input type="checkbox" bind:checked={appSettings.current.showClientMods} /> Show modified
						clients</label
					>
					<p class="is-size-7">
						(Mostly <a href="https://github.com/NotNite/RNSReloaded" target="_blank">RnS Reloaded</a
						> or other steam versions/betas)
					</p>
				</div>
				<div class="field">
					<label class="checkbox pb-1"
						><input type="checkbox" bind:checked={appSettings.current.saveFilters} /> Save lobby filter
						settings between sessions</label
					>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
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
