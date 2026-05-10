// place files you want to import through the `$lib` alias in this folder.

export type Lobby = {
	id: string;
	name: string;
	desc: string;
	difficulty: number;
	password_locked: boolean;
	player_num: number;
	member_num: number;
	max_players: number;
	stage_first: number;
	disbanded: boolean;
	modded: boolean;
	language: number;
	lobby_type: number;
	char0: number | null;
	palette0: number | null;
	char1: number | null;
	palette1: number | null;
	char2: number | null;
	palette2: number | null;
	char3: number | null;
	palette3: number | null;
	client_num: number;
	list_mode: number;
	online_version: number;
};

export type AreaName = [
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
	'Toybox',
	'Unknown'
][number];

export const areaMap: Record<number, AreaName> = {
	0: 'Random',
	1: 'ScholarsNest',
	2: 'KingsArsenal',
	3: 'RedDarkhouse',
	4: 'ChurchmouseStreets',
	5: 'EmeraldLakeside',
	6: 'DarkhouseDepths',
	7: 'SubterraSanctum',
	8: 'AtelierAurum',
	9: 'ExRandom',
	10: 'TrueRandom',
	11: 'ChaoticRandom',
	12: 'Toybox',
	20: 'Unknown'
};

export type Difficulty = ['Cute', 'Normal', 'Hard', 'Lunar'][number];

export const difficultyClassMap: Record<number, string> = {
	0: 'cute',
	1: 'normal',
	2: 'hard',
	3: 'lunar'
};

export const difficultyMap: Record<number, Difficulty> = {
	0: 'Cute',
	1: 'Normal',
	2: 'Hard',
	3: 'Lunar'
};

export type ClassName = [
	'Wizard',
	'Assassin',
	'Heavyblade',
	'Dancer',
	'Druid',
	'Spellsword',
	'Sniper',
	'Bruiser',
	'Defender',
	'Ancient',
	'Hammermaid',
	'Pyromancer',
	'Grenadier',
	'Shadow'
][number];

export const classMap: Record<number, ClassName> = {
	0: 'Wizard',
	1: 'Assassin',
	2: 'Heavyblade',
	3: 'Dancer',
	4: 'Druid',
	5: 'Spellsword',
	6: 'Sniper',
	7: 'Bruiser',
	8: 'Defender',
	9: 'Ancient',
	10: 'Hammermaid',
	11: 'Pyromancer',
	12: 'Grenadier',
	13: 'Shadow'
};
