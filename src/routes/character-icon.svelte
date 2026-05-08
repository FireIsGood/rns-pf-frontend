<script lang="ts">
	import { classMap, type ClassName, type Lobby } from '$lib';
	import wizard0Icon from '$lib/assets/characters/Wizard0.png';
	import wizard1Icon from '$lib/assets/characters/Wizard1.png';
	import wizard2Icon from '$lib/assets/characters/Wizard2.png';
	import wizard3Icon from '$lib/assets/characters/Wizard3.png';
	import wizard4Icon from '$lib/assets/characters/Wizard4.png';
	import wizard5Icon from '$lib/assets/characters/Wizard5.png';
	import wizard6Icon from '$lib/assets/characters/Wizard6.png';
	import wizard7Icon from '$lib/assets/characters/Wizard7.png';
	import wizard8Icon from '$lib/assets/characters/Wizard8.png';
	import wizard9Icon from '$lib/assets/characters/Wizard9.png';

	import assassin0Icon from '$lib/assets/characters/Assassin0.png';
	import assassin1Icon from '$lib/assets/characters/Assassin1.png';
	import assassin2Icon from '$lib/assets/characters/Assassin2.png';
	import assassin3Icon from '$lib/assets/characters/Assassin3.png';
	import assassin4Icon from '$lib/assets/characters/Assassin4.png';
	import assassin5Icon from '$lib/assets/characters/Assassin5.png';
	import assassin6Icon from '$lib/assets/characters/Assassin6.png';
	import assassin7Icon from '$lib/assets/characters/Assassin7.png';
	import assassin8Icon from '$lib/assets/characters/Assassin8.png';
	import assassin9Icon from '$lib/assets/characters/Assassin9.png';

	import heavyblade0Icon from '$lib/assets/characters/Heavyblade0.png';
	import heavyblade1Icon from '$lib/assets/characters/Heavyblade1.png';
	import heavyblade2Icon from '$lib/assets/characters/Heavyblade2.png';
	import heavyblade3Icon from '$lib/assets/characters/Heavyblade3.png';
	import heavyblade4Icon from '$lib/assets/characters/Heavyblade4.png';
	import heavyblade5Icon from '$lib/assets/characters/Heavyblade5.png';
	import heavyblade6Icon from '$lib/assets/characters/Heavyblade6.png';
	import heavyblade7Icon from '$lib/assets/characters/Heavyblade7.png';
	import heavyblade8Icon from '$lib/assets/characters/Heavyblade8.png';
	import heavyblade9Icon from '$lib/assets/characters/Heavyblade9.png';

	import dancer0Icon from '$lib/assets/characters/Dancer0.png';
	import dancer1Icon from '$lib/assets/characters/Dancer1.png';
	import dancer2Icon from '$lib/assets/characters/Dancer2.png';
	import dancer3Icon from '$lib/assets/characters/Dancer3.png';
	import dancer4Icon from '$lib/assets/characters/Dancer4.png';
	import dancer5Icon from '$lib/assets/characters/Dancer5.png';
	import dancer6Icon from '$lib/assets/characters/Dancer6.png';
	import dancer7Icon from '$lib/assets/characters/Dancer7.png';
	import dancer8Icon from '$lib/assets/characters/Dancer8.png';
	import dancer9Icon from '$lib/assets/characters/Dancer9.png';

	import druid0Icon from '$lib/assets/characters/Druid0.png';
	import druid1Icon from '$lib/assets/characters/Druid1.png';
	import druid2Icon from '$lib/assets/characters/Druid2.png';
	import druid3Icon from '$lib/assets/characters/Druid3.png';
	import druid4Icon from '$lib/assets/characters/Druid4.png';
	import druid5Icon from '$lib/assets/characters/Druid5.png';
	import druid6Icon from '$lib/assets/characters/Druid6.png';
	import druid7Icon from '$lib/assets/characters/Druid7.png';
	import druid8Icon from '$lib/assets/characters/Druid8.png';
	import druid9Icon from '$lib/assets/characters/Druid9.png';

	import spellsword0Icon from '$lib/assets/characters/Spellsword0.png';
	import spellsword1Icon from '$lib/assets/characters/Spellsword1.png';
	import spellsword2Icon from '$lib/assets/characters/Spellsword2.png';
	import spellsword3Icon from '$lib/assets/characters/Spellsword3.png';
	import spellsword4Icon from '$lib/assets/characters/Spellsword4.png';
	import spellsword5Icon from '$lib/assets/characters/Spellsword5.png';
	import spellsword6Icon from '$lib/assets/characters/Spellsword6.png';
	import spellsword7Icon from '$lib/assets/characters/Spellsword7.png';
	import spellsword8Icon from '$lib/assets/characters/Spellsword8.png';
	import spellsword9Icon from '$lib/assets/characters/Spellsword9.png';

	import sniper0Icon from '$lib/assets/characters/Sniper0.png';
	import sniper1Icon from '$lib/assets/characters/Sniper1.png';
	import sniper2Icon from '$lib/assets/characters/Sniper2.png';
	import sniper3Icon from '$lib/assets/characters/Sniper3.png';
	import sniper4Icon from '$lib/assets/characters/Sniper4.png';
	import sniper5Icon from '$lib/assets/characters/Sniper5.png';
	import sniper6Icon from '$lib/assets/characters/Sniper6.png';
	import sniper7Icon from '$lib/assets/characters/Sniper7.png';
	import sniper8Icon from '$lib/assets/characters/Sniper8.png';
	import sniper9Icon from '$lib/assets/characters/Sniper9.png';

	import bruiser0Icon from '$lib/assets/characters/Bruiser0.png';
	import bruiser1Icon from '$lib/assets/characters/Bruiser1.png';
	import bruiser2Icon from '$lib/assets/characters/Bruiser2.png';
	import bruiser3Icon from '$lib/assets/characters/Bruiser3.png';
	import bruiser4Icon from '$lib/assets/characters/Bruiser4.png';
	import bruiser5Icon from '$lib/assets/characters/Bruiser5.png';
	import bruiser6Icon from '$lib/assets/characters/Bruiser6.png';
	import bruiser7Icon from '$lib/assets/characters/Bruiser7.png';
	import bruiser8Icon from '$lib/assets/characters/Bruiser8.png';
	import bruiser9Icon from '$lib/assets/characters/Bruiser9.png';

	import defender0Icon from '$lib/assets/characters/Defender0.png';
	import defender1Icon from '$lib/assets/characters/Defender1.png';
	import defender2Icon from '$lib/assets/characters/Defender2.png';
	import defender3Icon from '$lib/assets/characters/Defender3.png';
	import defender4Icon from '$lib/assets/characters/Defender4.png';
	import defender5Icon from '$lib/assets/characters/Defender5.png';
	import defender6Icon from '$lib/assets/characters/Defender6.png';
	import defender7Icon from '$lib/assets/characters/Defender7.png';
	import defender8Icon from '$lib/assets/characters/Defender8.png';
	import defender9Icon from '$lib/assets/characters/Defender9.png';

	import ancient0Icon from '$lib/assets/characters/Ancient0.png';
	import ancient1Icon from '$lib/assets/characters/Ancient1.png';
	import ancient2Icon from '$lib/assets/characters/Ancient2.png';
	import ancient3Icon from '$lib/assets/characters/Ancient3.png';
	import ancient4Icon from '$lib/assets/characters/Ancient4.png';
	import ancient5Icon from '$lib/assets/characters/Ancient5.png';
	import ancient6Icon from '$lib/assets/characters/Ancient6.png';
	import ancient7Icon from '$lib/assets/characters/Ancient7.png';
	import ancient8Icon from '$lib/assets/characters/Ancient8.png';
	import ancient9Icon from '$lib/assets/characters/Ancient9.png';

	import hammermaid0Icon from '$lib/assets/characters/Hammermaid0.png';
	import hammermaid1Icon from '$lib/assets/characters/Hammermaid1.png';
	import hammermaid2Icon from '$lib/assets/characters/Hammermaid2.png';
	import hammermaid3Icon from '$lib/assets/characters/Hammermaid3.png';
	import hammermaid4Icon from '$lib/assets/characters/Hammermaid4.png';
	import hammermaid5Icon from '$lib/assets/characters/Hammermaid5.png';
	import hammermaid6Icon from '$lib/assets/characters/Hammermaid6.png';
	import hammermaid7Icon from '$lib/assets/characters/Hammermaid7.png';
	import hammermaid8Icon from '$lib/assets/characters/Hammermaid8.png';
	import hammermaid9Icon from '$lib/assets/characters/Hammermaid9.png';

	import pyromancer0Icon from '$lib/assets/characters/Pyromancer0.png';
	import pyromancer1Icon from '$lib/assets/characters/Pyromancer1.png';
	import pyromancer2Icon from '$lib/assets/characters/Pyromancer2.png';
	import pyromancer3Icon from '$lib/assets/characters/Pyromancer3.png';
	import pyromancer4Icon from '$lib/assets/characters/Pyromancer4.png';
	import pyromancer5Icon from '$lib/assets/characters/Pyromancer5.png';
	import pyromancer6Icon from '$lib/assets/characters/Pyromancer6.png';
	import pyromancer7Icon from '$lib/assets/characters/Pyromancer7.png';
	import pyromancer8Icon from '$lib/assets/characters/Pyromancer8.png';
	import pyromancer9Icon from '$lib/assets/characters/Pyromancer9.png';

	import grenadier0Icon from '$lib/assets/characters/Grenadier0.png';
	import grenadier1Icon from '$lib/assets/characters/Grenadier1.png';
	import grenadier2Icon from '$lib/assets/characters/Grenadier2.png';
	import grenadier3Icon from '$lib/assets/characters/Grenadier3.png';
	import grenadier4Icon from '$lib/assets/characters/Grenadier4.png';
	import grenadier5Icon from '$lib/assets/characters/Grenadier5.png';
	import grenadier6Icon from '$lib/assets/characters/Grenadier6.png';
	import grenadier7Icon from '$lib/assets/characters/Grenadier7.png';
	import grenadier8Icon from '$lib/assets/characters/Grenadier8.png';
	import grenadier9Icon from '$lib/assets/characters/Grenadier9.png';

	import shadow0Icon from '$lib/assets/characters/Shadow0.png';
	import shadow1Icon from '$lib/assets/characters/Shadow1.png';
	import shadow2Icon from '$lib/assets/characters/Shadow2.png';
	import shadow3Icon from '$lib/assets/characters/Shadow3.png';
	import shadow4Icon from '$lib/assets/characters/Shadow4.png';
	import shadow5Icon from '$lib/assets/characters/Shadow5.png';
	import shadow6Icon from '$lib/assets/characters/Shadow6.png';
	import shadow7Icon from '$lib/assets/characters/Shadow7.png';
	import shadow8Icon from '$lib/assets/characters/Shadow8.png';
	import shadow9Icon from '$lib/assets/characters/Shadow9.png';

	let { character, palette, ...others }: { character: number; palette: number; class?: string } =
		$props();

	const classIconMap: Record<ClassName, Record<number, string>> = {
		Wizard: {
			0: wizard0Icon,
			1: wizard1Icon,
			2: wizard2Icon,
			3: wizard3Icon,
			4: wizard4Icon,
			5: wizard5Icon,
			6: wizard6Icon,
			7: wizard7Icon,
			8: wizard8Icon,
			9: wizard9Icon
		},
		Assassin: {
			0: assassin0Icon,
			1: assassin1Icon,
			2: assassin2Icon,
			3: assassin3Icon,
			4: assassin4Icon,
			5: assassin5Icon,
			6: assassin6Icon,
			7: assassin7Icon,
			8: assassin8Icon,
			9: assassin9Icon
		},
		Heavyblade: {
			0: heavyblade0Icon,
			1: heavyblade1Icon,
			2: heavyblade2Icon,
			3: heavyblade3Icon,
			4: heavyblade4Icon,
			5: heavyblade5Icon,
			6: heavyblade6Icon,
			7: heavyblade7Icon,
			8: heavyblade8Icon,
			9: heavyblade9Icon
		},
		Dancer: {
			0: dancer0Icon,
			1: dancer1Icon,
			2: dancer2Icon,
			3: dancer3Icon,
			4: dancer4Icon,
			5: dancer5Icon,
			6: dancer6Icon,
			7: dancer7Icon,
			8: dancer8Icon,
			9: dancer9Icon
		},
		Druid: {
			0: druid0Icon,
			1: druid1Icon,
			2: druid2Icon,
			3: druid3Icon,
			4: druid4Icon,
			5: druid5Icon,
			6: druid6Icon,
			7: druid7Icon,
			8: druid8Icon,
			9: druid9Icon
		},
		Spellsword: {
			0: spellsword0Icon,
			1: spellsword1Icon,
			2: spellsword2Icon,
			3: spellsword3Icon,
			4: spellsword4Icon,
			5: spellsword5Icon,
			6: spellsword6Icon,
			7: spellsword7Icon,
			8: spellsword8Icon,
			9: spellsword9Icon
		},
		Sniper: {
			0: sniper0Icon,
			1: sniper1Icon,
			2: sniper2Icon,
			3: sniper3Icon,
			4: sniper4Icon,
			5: sniper5Icon,
			6: sniper6Icon,
			7: sniper7Icon,
			8: sniper8Icon,
			9: sniper9Icon
		},
		Bruiser: {
			0: bruiser0Icon,
			1: bruiser1Icon,
			2: bruiser2Icon,
			3: bruiser3Icon,
			4: bruiser4Icon,
			5: bruiser5Icon,
			6: bruiser6Icon,
			7: bruiser7Icon,
			8: bruiser8Icon,
			9: bruiser9Icon
		},
		Defender: {
			0: defender0Icon,
			1: defender1Icon,
			2: defender2Icon,
			3: defender3Icon,
			4: defender4Icon,
			5: defender5Icon,
			6: defender6Icon,
			7: defender7Icon,
			8: defender8Icon,
			9: defender9Icon
		},
		Ancient: {
			0: ancient0Icon,
			1: ancient1Icon,
			2: ancient2Icon,
			3: ancient3Icon,
			4: ancient4Icon,
			5: ancient5Icon,
			6: ancient6Icon,
			7: ancient7Icon,
			8: ancient8Icon,
			9: ancient9Icon
		},
		Hammermaid: {
			0: hammermaid0Icon,
			1: hammermaid1Icon,
			2: hammermaid2Icon,
			3: hammermaid3Icon,
			4: hammermaid4Icon,
			5: hammermaid5Icon,
			6: hammermaid6Icon,
			7: hammermaid7Icon,
			8: hammermaid8Icon,
			9: hammermaid9Icon
		},
		Pyromancer: {
			0: pyromancer0Icon,
			1: pyromancer1Icon,
			2: pyromancer2Icon,
			3: pyromancer3Icon,
			4: pyromancer4Icon,
			5: pyromancer5Icon,
			6: pyromancer6Icon,
			7: pyromancer7Icon,
			8: pyromancer8Icon,
			9: pyromancer9Icon
		},
		Grenadier: {
			0: grenadier0Icon,
			1: grenadier1Icon,
			2: grenadier2Icon,
			3: grenadier3Icon,
			4: grenadier4Icon,
			5: grenadier5Icon,
			6: grenadier6Icon,
			7: grenadier7Icon,
			8: grenadier8Icon,
			9: grenadier9Icon
		},
		Shadow: {
			0: shadow0Icon,
			1: shadow1Icon,
			2: shadow2Icon,
			3: shadow3Icon,
			4: shadow4Icon,
			5: shadow5Icon,
			6: shadow6Icon,
			7: shadow7Icon,
			8: shadow8Icon,
			9: shadow9Icon
		}
	};

	const characterIconSrc = $derived(classIconMap[classMap[character]][palette]);
</script>

<img src={characterIconSrc} {...others} />
