<script lang="ts">
	import modIcon from '$lib/assets/Mod Icon.png';
	import lockIcon from '$lib/assets/Lock Icon.png';
	import { areaMap, type Lobby } from '$lib';
	import AreaIcon from './area-icon.svelte';

	let { lobby }: { lobby: Lobby } = $props();
</script>

<div class="lobby-icon">
	<AreaIcon area={areaMap[lobby.stage_first]} class="image is-1by1 is-32x32" />
	{#if lobby.modded}
		<img src={modIcon} alt="" class="image is-1by1 is-16x16 icon-modded" />
	{/if}
	{#if lobby.password_locked}
		<img src={lockIcon} alt="" class="image is-1by1 is-16x16 icon-lock" />
	{/if}
</div>

<style>
	.lobby-icon {
		display: grid;
		& :global(*) {
			grid-area: 1 / -1;
		}
	}

	.icon-modded {
		justify-self: start;
		align-self: end;
		margin-left: -3px;
	}

	.icon-lock {
		justify-self: end;
		align-self: end;
		margin-right: -3px;
	}
</style>
