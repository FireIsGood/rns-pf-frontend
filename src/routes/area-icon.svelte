<script lang="ts">
	import { type AreaName } from '$lib';
	import randomIcon from '$lib/assets/stages/Random.webp';
	import scholarsNestIcon from '$lib/assets/stages/ScholarsNest.webp';
	import kingsArsenalIcon from '$lib/assets/stages/KingsArsenal.webp';
	import redDarkhouseIcon from '$lib/assets/stages/RedDarkhouse.webp';
	import churchmouseStreetsIcon from '$lib/assets/stages/ChurchmouseStreets.webp';
	import emeraldLakesideIcon from '$lib/assets/stages/EmeraldLakeside.webp';
	import darkhouseDepthsIcon from '$lib/assets/stages/DarkhouseDepths.png';
	import subterraSanctumIcon from '$lib/assets/stages/SubterraSanctum.png';
	import atelierAurumIcon from '$lib/assets/stages/AtelierAurum.png';
	import exRandomIcon from '$lib/assets/stages/ExRandom.png';
	import trueRandomIcon from '$lib/assets/stages/TrueRandom.png';
	import chaoticRandomIcon from '$lib/assets/stages/ChaoticRandom.png';
	import toyboxIcon from '$lib/assets/stages/Toybox.webp';
	import unknownIcon from '$lib/assets/Unknown Icon.png';

	let { area, ...others }: { area: AreaName; class?: string; draggable?: 'true' | 'false' } =
		$props();

	const iconMap: Record<AreaName, string> = {
		Random: randomIcon,
		ScholarsNest: scholarsNestIcon,
		KingsArsenal: kingsArsenalIcon,
		RedDarkhouse: redDarkhouseIcon,
		ChurchmouseStreets: churchmouseStreetsIcon,
		EmeraldLakeside: emeraldLakesideIcon,
		DarkhouseDepths: darkhouseDepthsIcon,
		SubterraSanctum: subterraSanctumIcon,
		AtelierAurum: atelierAurumIcon,
		ExRandom: exRandomIcon,
		TrueRandom: trueRandomIcon,
		ChaoticRandom: chaoticRandomIcon,
		Toybox: toyboxIcon,
		Unknown: unknownIcon
	};
	const areaIconSrc = $derived(iconMap[area]);
</script>

<img src={areaIconSrc} {...others} />
