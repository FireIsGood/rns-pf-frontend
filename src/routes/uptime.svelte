<script module>
	export type uptimeMessage = {
		type: 'synchronized' | 'heartbeat' | 'connected' | 'disconnected';
	};
</script>

<script lang="ts">
	import { appState, ServerStatus } from '$lib/util.svelte';
	import { onMount } from 'svelte';

	// Connection
	let intervalId: NodeJS.Timeout;
	let timeSinceLastUpdate = $state(0);

	onMount(() => {
		document.addEventListener('uptimeMessage', (e) => {
			if (!(e instanceof CustomEvent)) return;
			const event: CustomEvent<uptimeMessage> = e;
			const eventType = event.detail.type;

			switch (eventType) {
				case 'disconnected':
					return;
				case 'heartbeat':
					jumpy();
				case 'connected':
				case 'synchronized':
					timeSinceLastUpdate = 0;

					clearInterval(intervalId);
					intervalId = setInterval(() => (timeSinceLastUpdate += 1), 1000);
					break;
			}
		});
		return () => {
			clearInterval(intervalId);
		};
	});

	// Ping indicator
	let jumping = $state(false);
	function jumpy() {
		jumping = false;
		// Wait a frame so that the animation is canceled
		requestAnimationFrame(() => {
			jumping = true;
		});
	}
</script>

<div class="uptime-text is-size-7 px-2">
	<p class="cell">
		connection:
		{#if appState.serverStatus === ServerStatus.PENDING}
			<span class="has-text-info has-text-weight-semibold">loading...</span>
		{:else if appState.serverStatus === ServerStatus.DISCONNECTED || timeSinceLastUpdate >= 60}
			<span class="has-text-danger has-text-weight-semibold">No</span>
			<br />
			<em>(reload the page!)</em>
		{:else if timeSinceLastUpdate >= 30}
			<span class="has-text-warning has-text-weight-semibold">uh oh</span>
		{:else}
			<span class="has-text-success has-text-weight-semibold">yeah</span>
		{/if}
	</p>
	<button class="cell has-text-centered" class:jumping onclick={jumpy}>🐇</button>
	<p class="cell has-text-right">
		synchronized <span class="is-family-code has-text-weight-semibold">{timeSinceLastUpdate}</span>s
		ago
	</p>
</div>

<style>
	.uptime-text {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 0.5rem;
	}

	.jumping {
		animation: jumpy 250ms linear;
		user-select: none;
	}

	@keyframes jumpy {
		0% {
			translate: 0 0;
		}
		20% {
			translate: 0 -2px;
		}
		50% {
			translate: 0 -3px;
		}
		60% {
			translate: 0 -3px;
		}
		100% {
			translate: 0 0;
		}
	}
</style>
