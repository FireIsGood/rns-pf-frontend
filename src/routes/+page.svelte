<script lang="ts" module>
	export type StreamMessage = {
		type: 'reconnect';
	};
</script>

<script lang="ts">
	import LobbyDisplay from './lobby-display.svelte';
	import Notifications from './notifications.svelte';
	import Uptime from './uptime.svelte';
	import { ChangeKind, connectStream } from '$lib/stream-api';
	import { toastManager } from '$lib/toastStore.svelte';
	import { appSettings, appState, sendEvent, ServerStatus } from '$lib/util.svelte';
	import type { UptimeMessage } from './uptime.svelte';
	import Filters from './filters.svelte';
	import { onMount } from 'svelte';
	import type { Lobby } from '$lib';

	async function initializeLobbies() {
		appState.lobbies = [];

		connectStream(
			{ uncensored: appSettings.current.showUncensored },
			(changes) => {
				if (changes === null) {
					sendEvent<UptimeMessage>('uptimeMessage', { type: 'heartbeat' });
					return;
				}

				// Find lobbies that exist already
				const diffIds = new Set(
					changes.data.filter((ch) => ch.kind == ChangeKind.ADD).map((ch) => ch.id)
				);
				const existingLobbies = new Set(appState.lobbies.map((l) => l.id));

				// Parse all changes
				for (const change of changes.data) {
					switch (change.kind) {
						case ChangeKind.ADD:
							// Prevent duplication
							const duplicatedId = existingLobbies.has(change.id ?? '');
							if (duplicatedId) {
								console.error('Tried to add an existing ID, aborting!');
								return;
							}

							appState.lobbies.push(change as Lobby);
							break;

						case ChangeKind.UPDATE:
							appState.lobbies = appState.lobbies.map((l) => {
								if (l.id === change.id) {
									return { ...l, ...change };
								} else {
									return l;
								}
							});
							break;

						case ChangeKind.REMOVE:
							appState.lobbies = appState.lobbies.filter((l) => l.id !== change.id);
							break;
					}
				}

				// Update list of new lobbies for notifications
				appState.newLobbies = appState.lobbies.filter((l) => diffIds.has(l.id));

				sendEvent<UptimeMessage>('uptimeMessage', { type: 'synchronized' });
			},
			() => {
				// Packet error, attempt to reconnect automatically
				appState.lobbies = [];
				sendEvent<StreamMessage>('streamMessage', { type: 'reconnect' });
			}
		)
			.then(() => {
				toastManager.addToast('Connected to RnS-PF', 'success');
				appState.serverStatus = ServerStatus.CONNECTED;
				sendEvent<UptimeMessage>('uptimeMessage', { type: 'connected' });
			})
			.catch((err) => {
				console.log('Unable to connect to the API', err);
				toastManager.addToast('Disconnected from RnS-PF', 'warn');
				appState.serverStatus = ServerStatus.DISCONNECTED;
				sendEvent<UptimeMessage>('uptimeMessage', { type: 'disconnected' });
			});
	}

	onMount(() => {
		initializeLobbies();

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
</script>

<section class="container section app-layout" class:show-sidebar={appSettings.current.showSidebar}>
	<div class="options"><Filters /><Notifications /></div>
	<div class="uptime"><Uptime /></div>
	<div class="lobbies"><LobbyDisplay /></div>
</section>

<style>
	.app-layout {
		height: 100%;
		display: grid;
		grid-template-areas:
			'lobbies'
			'uptime';
		grid-template-rows: auto 1fr;

		&.show-sidebar {
			grid-template-areas:
				'options lobbies'
				'uptime lobbies';

			grid-template-columns: 28rem 1fr;
			grid-template-rows: auto 1fr;
			column-gap: 1.5rem;
			row-gap: 1rem;
		}
	}

	.options {
		grid-area: options;
		display: none;

		.show-sidebar > & {
			display: block;
		}
	}

	.uptime {
		grid-area: uptime;
		margin-top: auto;

		.show-sidebar > & {
			margin-top: unset;
		}
	}

	.lobbies {
		grid-area: lobbies;
	}

	@media print, screen and (max-width: 1023px) {
		:root .app-layout {
			grid-template-areas:
				'options'
				'lobbies'
				'uptime';

			grid-template-columns: auto;
			grid-template-rows: auto;
			row-gap: 0;
		}

		:root .options {
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
