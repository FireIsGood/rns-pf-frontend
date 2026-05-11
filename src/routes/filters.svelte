<script lang="ts">
	import { areaMap, difficultyMap, type AreaName, type Difficulty } from '$lib';
	import Modal from './modal.svelte';
	import AreaIcon from './area-icon.svelte';
	import GearIcon from '$lib/assets/gear.svelte';
	import CaretUp from '$lib/assets/caret-up.svelte';
	import numberZeroIcon from '$lib/assets/Number 0.png';
	import numberOneIcon from '$lib/assets/Number 1.png';
	import numberTwoIcon from '$lib/assets/Number 2.png';
	import numberThreeIcon from '$lib/assets/Number 3.png';
	import numberFourIcon from '$lib/assets/Number 4.png';
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
	import { appSettings, appState, lobbyFilters, playersInLobby, sendEvent } from '$lib/util.svelte';
	import { type StreamMessage } from './+page.svelte';

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
					(lobbyFilters.current.minimumPlayers === 'Any' ||
						lobbyFilters.current.minimumPlayers <= playersInLobby(l)) &&
					(lobbyFilters.current.minimumOpenings === 'Any' ||
						lobbyFilters.current.minimumOpenings <= l.max_players - playersInLobby(l)) &&
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

	let collapsed = $state(true);
</script>

{#snippet filterButton(iconSrc: string, highlighted: boolean, callback: () => void)}
	<button class="button p-1 is-flex-grow-1" class:highlighted onclick={callback} disabled={!browser}
		><img src={iconSrc} alt="" class="image is-1by1 is-24x24" /></button
	>
{/snippet}

<Modal bind:active={filterModalActive}>
	{#snippet header()}
		<p class="card-header-title">Filter Options</p>
	{/snippet}
	{#snippet children()}
		<div class="field">
			<label class="checkbox pb-1"
				><input type="checkbox" bind:checked={appSettings.current.showClientMods} /> Show modified clients</label
			>
			<p class="is-size-7">
				Mostly <a href="https://github.com/NotNite/RNSReloaded" target="_blank">RnS Reloaded</a> or other
				steam versions/betas.
			</p>
		</div>
		<div class="field">
			<label class="checkbox pb-1"
				><input
					type="checkbox"
					bind:checked={appSettings.current.showUncensored}
					onchange={() => {
						sendEvent<StreamMessage>('streamMessage', { type: 'reconnect' });
					}}
				/> Show uncensored lobby names</label
			>
			<p class="is-size-7">
				Example: <strong
					>{appSettings.current.showUncensored ? 'Rabbit-chat' : 'Rab******at'}</strong
				>
			</p>
		</div>
		<div class="field">
			<label class="checkbox pb-1"
				><input type="checkbox" bind:checked={appSettings.current.saveFilters} /> Save lobby filter settings
				between sessions</label
			>
		</div>
		<p class="block"><strong>Visible Filters</strong></p>
		<div class="checkboxes">
			<label class="checkbox pb-1"
				><input type="checkbox" bind:checked={appSettings.current.showFilterDestination} /> Destination</label
			>
			<label class="checkbox pb-1"
				><input type="checkbox" bind:checked={appSettings.current.showFilterDifficulty} /> Difficulty</label
			>
			<label class="checkbox pb-1"
				><input type="checkbox" bind:checked={appSettings.current.showFilterMinimumPlayers} /> Minimum
				Players</label
			>
			<label class="checkbox pb-1"
				><input type="checkbox" bind:checked={appSettings.current.showFilterMinimumOpenings} /> Minimum
				Openings</label
			>
			<label class="checkbox pb-1"
				><input type="checkbox" bind:checked={appSettings.current.showFilterPassword} /> Password Locked</label
			>
			<label class="checkbox pb-1"
				><input type="checkbox" bind:checked={appSettings.current.showFilterMods} /> Using Mods</label
			>
		</div>
	{/snippet}
</Modal>

<div class="card card-collapsible" class:is-collapsed={collapsed}>
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
		{#if appSettings.current.showFilterDestination}
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
		{/if}
		{#if appSettings.current.showFilterDifficulty}
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
		{/if}
		{#if appSettings.current.showFilterMinimumPlayers}
			<div class="mb-1 has-text-centered is-size-7">Minimum Players</div>
			<fieldset class="filter-group">
				{@render filterButton(numberZeroIcon, lobbyFilters.current.minimumPlayers === 'Any', () => {
					lobbyFilters.current.minimumPlayers = 'Any';
				})}
				{@render filterButton(numberOneIcon, lobbyFilters.current.minimumPlayers === 1, () => {
					lobbyFilters.current.minimumPlayers = 1;
				})}
				{@render filterButton(numberTwoIcon, lobbyFilters.current.minimumPlayers === 2, () => {
					lobbyFilters.current.minimumPlayers = 2;
				})}
				{@render filterButton(numberThreeIcon, lobbyFilters.current.minimumPlayers === 3, () => {
					lobbyFilters.current.minimumPlayers = 3;
				})}
				{@render filterButton(numberFourIcon, lobbyFilters.current.minimumPlayers === 4, () => {
					lobbyFilters.current.minimumPlayers = 4;
				})}
			</fieldset>
		{/if}
		{#if appSettings.current.showFilterMinimumOpenings}
			<div class="mb-1 has-text-centered is-size-7">Minimum Openings</div>
			<fieldset class="filter-group">
				{@render filterButton(
					numberZeroIcon,
					lobbyFilters.current.minimumOpenings === 'Any',
					() => {
						lobbyFilters.current.minimumOpenings = 'Any';
					}
				)}
				{@render filterButton(numberOneIcon, lobbyFilters.current.minimumOpenings === 1, () => {
					lobbyFilters.current.minimumOpenings = 1;
				})}
				{@render filterButton(numberTwoIcon, lobbyFilters.current.minimumOpenings === 2, () => {
					lobbyFilters.current.minimumOpenings = 2;
				})}
				{@render filterButton(numberThreeIcon, lobbyFilters.current.minimumOpenings === 3, () => {
					lobbyFilters.current.minimumOpenings = 3;
				})}
				{@render filterButton(numberFourIcon, lobbyFilters.current.minimumOpenings === 4, () => {
					lobbyFilters.current.minimumOpenings = 4;
				})}
			</fieldset>
		{/if}
		{#if appSettings.current.showFilterPassword}
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
		{/if}
		{#if appSettings.current.showFilterMods}
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
		{/if}
	</div>
	<div class="card-footer is-hidden-desktop">
		<button class="card-footer-item collapse-button" onclick={() => (collapsed = !collapsed)}
			><span class="collapse-icon"><CaretUp /></span></button
		>
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
