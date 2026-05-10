import type { Lobby } from '$lib';
import { persistedState } from 'svelte-persisted-state';

interface AppSettings {
	trackingNames: string[];
	trackingNotifySilent: boolean;
}

export const appSettings = persistedState<AppSettings>(
	'app',
	{
		trackingNames: [],
		trackingNotifySilent: false
	},
	{
		onWriteError: (err) => {
			console.error('Failed to write preferences', err);
		},
		onParseError: (err) => {
			console.error('Failed to parse preferences', err);
		}
	}
);

interface AppState {
	lobbies: Lobby[];
	lobbiesFiltered: Lobby[];
}

export const appState = $state<AppState>({
	lobbies: [],
	lobbiesFiltered: []
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
