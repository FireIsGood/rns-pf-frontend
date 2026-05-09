<script lang="ts">
	import type { Lobby } from '$lib';
	import { tracking } from '$lib/util.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import GearIcon from '$lib/assets/gear.svelte';
	import XIcon from '$lib/assets/x.svelte';

	let { newLobbies }: { newLobbies: Lobby[] } = $props();

	let trackingFormValue: string = $state('');

	async function addTracking(lobbyName: string) {
		if (Notification.permission !== 'granted') {
			await Notification.requestPermission();
		}

		trackingFormValue = '';
		const invalidName = tracking.trackingNames.includes(lobbyName) || lobbyName === '';
		if (invalidName) {
			console.log('Already tracking');
			return;
		}

		tracking.addTracking(lobbyName);
	}

	function removeTracking(lobbyName: string) {
		tracking.removeTracking(lobbyName);
	}

	// Watch for lobby changes
	$effect(() => {
		const notifyLobbies = newLobbies.filter((l) => tracking.trackingNames.includes(l.name));
		if (notifyLobbies.length > 0) {
			const notOnPage = !document.hasFocus();
			if (Notification.permission === 'granted' && notOnPage) {
				for (const lobby of notifyLobbies) {
					const lobbyNotification = new Notification('Rabbit and Steel Partyfinder', {
						body: `Lobby: ${lobby.name} (${lobby.desc})`,
						icon: `/favicon-96x96.png`,
						silent: tracking.silentNotify
					});

					// Auto-close when viewing page
					document.addEventListener('visibilitychange', () => lobbyNotification.close(), {
						once: true
					});
				}
			}
		}
	});

	let notificationModalActive = $state(false);

	// Has to be done outside of the module due to binding
	$effect(() => {
		localStorage.setItem('silentNotify', tracking.silentNotify.toString());
	});
</script>

<div class="card">
	<header class="card-header">
		<p class="card-header-title">Notifications</p>
		<button
			class="button card-header-icon is-size-5"
			aria-label="collapse"
			onclick={() => (notificationModalActive = true)}
		>
			<GearIcon />
		</button>
	</header>
	<div class="card-content">
		<div class="tags">
			{#each tracking.trackingNames.toSorted((a, b) => a.localeCompare(b)) as name (name)}
				<span
					class="tag tracking-tag has-background-info-soft"
					transition:fly={{ duration: 200, x: 20 }}
					animate:flip={{ duration: 200 }}
				>
					<span>{name}</span>
					<button
						class="delete-button has-text-danger has-text-weight-bold"
						onclick={() => removeTracking(name)}
					>
						<XIcon />
					</button>
				</span>
			{/each}
		</div>
		<fieldset class="field has-addons">
			<div class="control is-flex-grow-1">
				<input type="text" placeholder="Lobby name" class="input" bind:value={trackingFormValue} />
			</div>
			<div class="control">
				<button class="button is-primary is-soft" onclick={() => addTracking(trackingFormValue)}
					>Add Tracking</button
				>
			</div>
		</fieldset>
	</div>
</div>

<div class="modal" class:is-active={notificationModalActive}>
	<div class="modal-background"></div>
	<div class="modal-content">
		<div class="card">
			<header class="card-header">
				<p class="card-header-title">Notification Options</p>
				<button
					class="button card-header-icon is-size-5"
					aria-label="close"
					onclick={() => (notificationModalActive = false)}
				>
					<XIcon />
				</button>
			</header>
			<div class="card-content">
				<label class="checkbox"
					><input type="checkbox" bind:checked={tracking.silentNotify} /> Silent notifications</label
				>
			</div>
		</div>
	</div>
</div>

<style>
	.tracking-tag {
		display: inline-flex;
		gap: 0.5em;
	}
	.delete-button {
		display: block;
		line-height: 0.5;
		font-size: 1.25em;
		padding-inline: 0.25rem;
		margin-inline: -0.25rem;
	}
</style>
