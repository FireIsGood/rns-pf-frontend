<script lang="ts">
	import { type AreaName } from '$lib';
	import { lobbyFilters } from '$lib/util.svelte';

	const areaReadableMap: Record<AreaName, string> = {
		Random: 'Random Kingdom',
		ScholarsNest: "Scholar's Nest",
		KingsArsenal: "Kingdom's Arsenal",
		RedDarkhouse: 'Red Darkhouse',
		ChurchmouseStreets: 'Churchmouse Streets',
		EmeraldLakeside: 'Emerald Lakeside',
		DarkhouseDepths: 'Darkhouse Depths',
		SubterraSanctum: 'Subterra Sanctum',
		AtelierAurum: 'Atelier Aurum',
		ExRandom: 'Random Extra',
		TrueRandom: 'True Random',
		ChaoticRandom: 'Chaotic Random',
		Toybox: 'Toybox',
		Unknown: 'Unknown'
	};

	const areaClassMap: Record<AreaName, string> = {
		Random: 'random',
		ScholarsNest: 'scholars-nest',
		KingsArsenal: 'kings-arsenal',
		RedDarkhouse: 'red-darkhouse',
		ChurchmouseStreets: 'churchmouse-streets',
		EmeraldLakeside: 'emerald-lakeside',
		DarkhouseDepths: 'darkhouse-depths',
		SubterraSanctum: 'subterra-sanctum',
		AtelierAurum: 'atelier-aurum',
		ExRandom: 'extra-random',
		TrueRandom: 'true-random',
		ChaoticRandom: 'chaotic-random',
		Toybox: 'toybox',
		Unknown: 'unknown'
	};

	let anyTags = $derived(Object.values(lobbyFilters.current).some((v) => v !== 'Any'));
</script>

<div class="filter-tags tags is-justify-content-center" class:is-active={anyTags}>
	{#if anyTags}
		{#if lobbyFilters.current.destination !== 'Any'}
			<span class={['tag filter-tag-destination', areaClassMap[lobbyFilters.current.destination]]}
				>{areaReadableMap[lobbyFilters.current.destination]}</span
			>
		{/if}
		{#if lobbyFilters.current.minimumPlayers !== 'Any'}
			<span class={['tag filter-tag-players', 'count-' + lobbyFilters.current.minimumPlayers]}
				>{lobbyFilters.current.minimumPlayers} player</span
			>
		{/if}
		{#if lobbyFilters.current.minimumOpenings !== 'Any'}
			<span class={['tag filter-tag-openings', 'count-' + lobbyFilters.current.minimumOpenings]}
				>{lobbyFilters.current.minimumOpenings} opening</span
			>
		{/if}
		{#if lobbyFilters.current.difficulty !== 'Any'}
			<span class={['tag filter-tag-difficulty', lobbyFilters.current.difficulty.toLowerCase()]}
				>{lobbyFilters.current.difficulty}</span
			>
		{/if}
		{#if lobbyFilters.current.password !== 'Any'}
			<span
				class={[
					'tag filter-tag-password',
					lobbyFilters.current.password ? 'has-password' : 'has-no-password'
				]}>{lobbyFilters.current.password ? 'Password' : 'No Password'}</span
			>
		{/if}
		{#if lobbyFilters.current.mods !== 'Any'}
			<span class={['tag filter-tag-mods', lobbyFilters.current.mods ? 'has-mods' : 'has-no-mods']}
				>{lobbyFilters.current.mods ? 'Modded' : 'Not Modded'}</span
			>
		{/if}
	{:else}
		<span class="tag placeholder"></span>
	{/if}
</div>

<style>
	.filter-tags {
		height: 0;
		margin-bottom: 0;
		transition:
			height 200ms ease-out,
			margin 200ms ease-out;
		interpolate-size: allow-keywords;

		&.is-active {
			height: auto;
			margin-bottom: var(--bulma-block-spacing);
		}
	}

	.filter-tag-destination {
		background-color: hsl(var(--area-h), var(--area-v, 40%), var(--bulma-soft-l));

		&.random {
			--area-h: 245;
			--area-v: 20%;
		}
		&.scholars-nest {
			--area-h: 262;
		}
		&.kings-arsenal {
			--area-h: 233;
		}
		&.red-darkhouse {
			--area-h: 356;
		}
		&.churchmouse-streets {
			--area-h: 44;
		}
		&.emerald-lakeside {
			--area-h: 138;
		}
		&.darkhouse-depths {
			--area-h: 331;
		}
		&.subterra-sanctum {
			--area-h: 196;
		}
		&.atelier-aurum {
			--area-h: 40;
		}
		&.extra-random {
			--area-h: 294;
		}
		&.true-random {
			--area-h: 332;
		}
		&.chaotic-random {
			--area-h: 248;
		}
		&.toybox {
			--area-h: 149;
		}
	}

	.filter-tag-players,
	.filter-tag-openings {
		background-color: hsl(var(--count-h), 20%, var(--bulma-soft-l));

		&.count-1 {
			--count-h: 206;
		}
		&.count-2 {
			--count-h: 242;
		}
		&.count-3 {
			--count-h: 289;
		}
		&.count-4 {
			--count-h: 310;
		}
	}
	.filter-tag-difficulty {
		background-color: hsl(var(--difficulty-h), 20%, var(--bulma-soft-l));

		&.cute {
			--difficulty-h: 206;
		}

		&.normal {
			--difficulty-h: 44;
		}

		&.hard {
			--difficulty-h: 352;
		}

		&.lunar {
			--difficulty-h: 264;
		}
	}

	.filter-tag-password {
		background-color: hsl(var(--password-h), 30%, var(--bulma-soft-l));

		&.has-password {
			--password-h: 32;
		}

		&.has-no-password {
			--password-h: 170;
		}
	}

	.filter-tag-mods {
		background-color: hsl(var(--mods-h), 30%, var(--bulma-soft-l));

		&.has-mods {
			--mods-h: 32;
		}

		&.has-no-mods {
			--mods-h: 170;
		}
	}

	.placeholder {
		opacity: 0;
	}
</style>
