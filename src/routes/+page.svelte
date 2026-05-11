<script lang="ts" module>
	export type StreamMessage = {
		type: 'reconnect';
	};
</script>

<script lang="ts">
	import LobbyDisplay from './lobby-display.svelte';
	import Notifications from './notifications.svelte';
	import Uptime from './uptime.svelte';
	import { connectStream } from '$lib/stream-api';
	import { toastManager } from '$lib/toastStore.svelte';
	import { appSettings, appState, sendEvent, ServerStatus } from '$lib/util.svelte';
	import type { UptimeMessage } from './uptime.svelte';
	import Filters from './filters.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';

	async function initializeLobbies() {
		try {
			const res = await connectStream(
				{ uncensored: appSettings.current.showUncensored },
				(chunk) => {
					if (chunk === null) {
						sendEvent<UptimeMessage>('uptimeMessage', { type: 'heartbeat' });
						return;
					}
					const currentIds = new Set(appState.lobbies.map((l) => l.id));
					const updatedIds = new Set(chunk.data.map((l) => l.id));
					const diffIds = updatedIds.difference(currentIds);
					const diffLobbies = chunk.data.filter((l) => diffIds.has(l.id));

					appState.newLobbies = diffLobbies;

					appState.lobbies = chunk.data;
					sendEvent<UptimeMessage>('uptimeMessage', { type: 'synchronized' });
				}
			);

			if (res instanceof ReadableStream) {
				toastManager.addToast('Connected to RnS-PF', 'success');
				appState.serverStatus = ServerStatus.CONNECTED;
				sendEvent<UptimeMessage>('uptimeMessage', { type: 'connected' });
			} else {
				console.error('How the hell did you get here? Please report this to the developers:', res);
			}
		} catch (_err) {
			// It's all screwed up. Reload the page!!
			location.reload();
		}
	}

	onMount(() => {
		function handleMessage(e: Event) {
			if (!(e instanceof CustomEvent)) return;
			const event: CustomEvent<StreamMessage> = e;
			const eventType = event.detail.type;
			switch (eventType) {
				case 'reconnect':
					initializeLobbies();
					break;
			}
		}
		document.addEventListener('streamMessage', handleMessage);

		return () => {
			document.removeEventListener('streamMessage', handleMessage);
		};
	});

	// Automatic restart for server issues
	onMount(() => {
		const heartbeat = new EventSource(`${PUBLIC_API_ENDPOINT}/events`);

		heartbeat.onopen = () => {
			initializeLobbies();
		};

		heartbeat.onerror = (err) => {
			console.log('Unable to connect to the API', err);
			appState.lobbies = [];
			appState.serverStatus = ServerStatus.DISCONNECTED;
		};
	});
</script>

<section class="container section app-layout">
	<div class="options"><Filters /><Notifications /></div>
	<div class="uptime"><Uptime /></div>
	<div class="lobbies"><LobbyDisplay /></div>
</section>

<style>
	.app-layout {
		display: grid;
		grid-template-areas:
			'options lobbies'
			'uptime lobbies';

		grid-template-columns: 28rem 1fr;
		grid-template-rows: auto auto auto;
		column-gap: 1.5rem;
		row-gap: 1rem;
	}

	.options {
		grid-area: options;
	}

	.uptime {
		grid-area: uptime;
	}

	.lobbies {
		grid-area: lobbies;
	}

	@media print, screen and (max-width: 1023px) {
		.app-layout {
			grid-template-areas:
				'options'
				'lobbies'
				'uptime';

			grid-template-columns: auto;
			grid-template-rows: auto;
			row-gap: 0;
		}

		.options {
			display: grid;
			grid-template-areas:
				'filter-toggle notification-toggle'
				'filters filters'
				'notifications notifications';
			grid-template-columns: min-content;
			column-gap: 1rem;
			row-gap: 0;
		}
	}
</style>
