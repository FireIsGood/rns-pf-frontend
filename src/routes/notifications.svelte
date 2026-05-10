<script lang="ts">
	import type { Lobby } from '$lib';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import GearIcon from '$lib/assets/gear.svelte';
	import XIcon from '$lib/assets/x.svelte';
	import { toastManager } from '$lib/toastStore.svelte';
	import { browser } from '$app/environment';
	import { appSettings } from '$lib/util.svelte';

	let { newLobbies }: { newLobbies: Lobby[] } = $props();

	let trackingFormValue: string = $state('');
	let trackingNames = appSettings.current.trackingNames;

	async function addTracking(lobbyName: string) {
		if (lobbyName === '') return;

		if (Notification.permission !== 'granted') {
			await Notification.requestPermission();
		}

		trackingFormValue = '';

		if (trackingNames.includes(lobbyName)) {
			toastManager.addToast('Already tracking this lobby name!', 'warn');
			return;
		}

		trackingNames.push(lobbyName);
		toastManager.addToast(`Tracked ${lobbyName}`, 'success');
	}

	function removeTracking(lobbyName: string) {
		const index = trackingNames.indexOf(lobbyName);
		if (index > -1) {
			trackingNames.splice(index, 1);
		} else {
			console.error(`Tried to remove tracking of ${lobbyName} but it was not being tracked.`);
		}
		toastManager.addToast(`Untracked ${lobbyName}`, 'success');
	}

	// Watch for lobby changes
	$effect(() => {
		const notifyLobbies = newLobbies.filter((l) => trackingNames.includes(l.name));
		if (Notification.permission === 'granted') {
			for (const lobby of notifyLobbies) {
				new Notification('Rabbit and Steel Partyfinder', {
					body: `Lobby: ${lobby.name} (${lobby.desc})`,
					icon: `/favicon-96x96.png`,
					silent: appSettings.current.trackingNotifySilent
				});
			}
		}
	});

	let notificationModalActive = $state(false);
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
		<div class="tracking-tag-list tags" class:skeleton-block={!browser}>
			{#each trackingNames.toSorted((a, b) => a.localeCompare(b)) as name (name)}
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
				<button
					class="button is-primary is-soft"
					onclick={() => addTracking(trackingFormValue)}
					disabled={!browser}>Add Tracking</button
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
					><input type="checkbox" bind:checked={appSettings.current.trackingNotifySilent} /> Silent notifications</label
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

	:where(.tracking-tag-list) {
		--bulma-skeleton-block-min-height: 1.5em;
		min-height: 0;
		transition: min-height 400ms allow-discrete;
	}
</style>
