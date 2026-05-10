import type { AreaName, Difficulty, Lobby } from '$lib';
import { persistedState } from 'svelte-persisted-state';

interface AppSettings {
	trackingNames: string[];
	trackingNotifySilent: boolean;
	trackingNotifyBackgroundOnly: boolean;
	showClientMods: boolean;
	saveFilters: boolean;
	showUncensored: boolean;
}

const defaultSettings: AppSettings = {
	trackingNames: [],
	trackingNotifySilent: false,
	trackingNotifyBackgroundOnly: false,
	showClientMods: false,
	saveFilters: false,
	showUncensored: false
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

interface LobbyFilters {
	destination: AreaName | 'Any';
	difficulty: Difficulty | 'Any';
	password: boolean | 'Any';
	mods: boolean | 'Any';
}

const defaultFilters: LobbyFilters = {
	destination: 'Any',
	difficulty: 'Any',
	password: 'Any',
	mods: 'Any'
};

export const lobbyFilters = persistedState<LobbyFilters>('lobbyFilters', defaultFilters, {
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

interface AppState {
	lobbies: Lobby[];
	lobbiesFiltered: Lobby[];
	newLobbies: Lobby[];
	serverStatus: ServerStatus;
}

export const appState = $state<AppState>({
	lobbies: [],
	lobbiesFiltered: [],
	newLobbies: [],
	serverStatus: ServerStatus.PENDING
});

export function typewriter(node: HTMLElement, { speed = 1 }: { speed?: number }) {
	const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

	if (!valid) {
		throw new Error(`This transition only works on elements with a single text node child`);
	}

	const text = node.textContent;
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
		console.log('Copied to clipboard');
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
