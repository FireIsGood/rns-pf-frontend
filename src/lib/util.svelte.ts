import { browser } from '$app/environment';
import type { AreaName, Difficulty, Lobby } from '$lib';
import { persistedState } from 'svelte-persisted-state';

interface AppSettings {
	trackingNames: string[];
	trackingNotifySilent: boolean;
	trackingNotifyBackgroundOnly: boolean;
	showClientMods: boolean;
	saveFilters: boolean;
	showUncensored: boolean;
	showFilterDestination: boolean;
	showFilterDifficulty: boolean;
	showFilterMinimumPlayers: boolean;
	showFilterMinimumOpenings: boolean;
	showFilterPassword: boolean;
	showFilterMods: boolean;
	animateBackground: boolean;
}

const defaultSettings: AppSettings = {
	trackingNames: [],
	trackingNotifySilent: false,
	trackingNotifyBackgroundOnly: false,
	showClientMods: false,
	saveFilters: false,
	showUncensored: false,
	showFilterDestination: true,
	showFilterDifficulty: true,
	showFilterMinimumPlayers: true,
	showFilterMinimumOpenings: true,
	showFilterPassword: true,
	showFilterMods: true,
	animateBackground: browser && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

export const appSettings = persistedState<AppSettings>('app', defaultSettings, {
	beforeRead: (value) => Object.assign(defaultSettings, value),
	onWriteError: (err) => {
		console.error('Failed to write preferences', err);
	},
	onParseError: (err) => {
		console.error('Failed to parse preferences', err);
	}
});

type LobbyFilterAny = 'Any';

export type LobbyFilters = {
	destination: AreaName | LobbyFilterAny;
	difficulty: Difficulty | LobbyFilterAny;
	minimumPlayers: number | LobbyFilterAny;
	minimumOpenings: number | LobbyFilterAny;
	password: boolean | LobbyFilterAny;
	mods: boolean | LobbyFilterAny;
};

const defaultFilters: LobbyFilters = {
	destination: 'Any',
	difficulty: 'Any',
	minimumPlayers: 'Any',
	minimumOpenings: 'Any',
	password: 'Any',
	mods: 'Any'
};

export const lobbyFilters = persistedState<LobbyFilters>('lobbyFilters', defaultFilters, {
	syncTabs: false,
	beforeRead: (value) => {
		if (appSettings.current.saveFilters === false) {
			return defaultFilters;
		}

		return value;
	},
	onWriteError: (err) => {
		console.error('Failed to write filters', err);
	},
	onParseError: (err) => {
		console.error('Failed to parse filters', err);
	}
});

export enum ServerStatus {
	CONNECTED,
	DISCONNECTED,
	PENDING
}

type OptionsTab = 'filters' | 'notifications' | null;

interface AppState {
	lobbies: Lobby[];
	lobbiesFiltered: Lobby[];
	newLobbies: Lobby[];
	serverStatus: ServerStatus;
	optionsTabActive: OptionsTab;
}

export const appState = $state<AppState>({
	lobbies: [],
	lobbiesFiltered: [],
	newLobbies: [],
	serverStatus: ServerStatus.PENDING,
	optionsTabActive: null
});

export function handleOptionsTab(tab: OptionsTab) {
	if (appState.optionsTabActive === tab) {
		appState.optionsTabActive = null;
	} else {
		appState.optionsTabActive = tab;
	}
}

export function playersInLobby(lobby: Lobby): number {
	const playerSlots: Array<keyof Lobby> = ['char0', 'char1', 'char2', 'char3'];
	return playerSlots.reduce<number>((c, a) => (c += +(lobby[a] !== null)), 0);
}

// If text changes rapidly such as by reading state, use forcedText
export function typewriter(
	node: HTMLElement,
	{ speed = 1, forcedText = undefined }: { speed?: number; forcedText?: string }
) {
	const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

	if (!valid) {
		console.error('Failed to use typewriter on node', node);
		return { duration: 0 };
	}

	const text = forcedText ?? node.textContent ?? '';

	const duration = text.length / (speed * 0.01);

	return {
		duration,
		tick: (t: number) => {
			const i = Math.trunc(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};
}

export async function copyText(text: string) {
	if ('clipboard' in navigator) {
		await navigator.clipboard.writeText(text);
	} else {
		console.error('Copy to clipboard not supported');
	}
}

export function pickRandom<T>(list: T[]): T {
	return list[Math.floor(list.length * Math.random())];
}

export function sendEvent<T>(type: string, eventData: T) {
	const customEvent = new CustomEvent<T>(type, {
		detail: eventData
	});
	document.dispatchEvent(customEvent);
}

export function degToRad(degree: number): number {
	return (degree / 360) * Math.PI * 2;
}

export function turnToRad(turn: number): number {
	return turn * Math.PI * 2;
}
