<script lang="ts" module>
	export type streamMessage = {
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
	import type { uptimeMessage } from './uptime.svelte';
	import Filters from './filters.svelte';
	import { onMount } from 'svelte';

	async function initializeLobbies() {
		const res = await connectStream({ uncensored: appSettings.current.showUncensored }, (chunk) => {
			if (chunk === null) {
				sendEvent<uptimeMessage>('uptimeMessage', { type: 'heartbeat' });
				return;
			}
			const currentIds = new Set(appState.lobbies.map((l) => l.id));
			const updatedIds = new Set(chunk.data.map((l) => l.id));
			const diffIds = updatedIds.difference(currentIds);
			const diffLobbies = chunk.data.filter((l) => diffIds.has(l.id));

			appState.newLobbies = diffLobbies;

			appState.lobbies = chunk.data;
			sendEvent<uptimeMessage>('uptimeMessage', { type: 'synchronized' });
		});

		if (res instanceof ReadableStream) {
			toastManager.addToast('Connected to RnS-PF', 'success');
			appState.serverStatus = ServerStatus.CONNECTED;
			sendEvent<uptimeMessage>('uptimeMessage', { type: 'connected' });
		}
		if (res instanceof TypeError) {
			toastManager.addToast('Error connecting to RnS-PF', 'warn');
			appState.serverStatus = ServerStatus.DISCONNECTED;
			sendEvent<uptimeMessage>('uptimeMessage', { type: 'disconnected' });
		}
	}

	$effect(() => {
		initializeLobbies();
	});

	onMount(() => {
		function handleMessage(e: Event) {
			if (!(e instanceof CustomEvent)) return;
			const event: CustomEvent<streamMessage> = e;
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

<section class="container section columns is-desktop">
	<div class="sidebar-options column is-narrow">
		<Filters />
		<Notifications />
		<Uptime />
	</div>
	<div class="column">
		<LobbyDisplay />
	</div>
</section>

<style>
	@media print, screen and (min-width: 1024px) {
		.sidebar-options {
			max-width: 28rem;
		}
	}
</style>
