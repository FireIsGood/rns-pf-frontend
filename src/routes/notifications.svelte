<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import Modal from './modal.svelte';
	import GearIcon from '$lib/assets/gear.svelte';
	import CaretUp from '$lib/assets/caret-up.svelte';
	import XIcon from '$lib/assets/x.svelte';
	import NotificationEnabled from '$lib/assets/bell-ringing.svelte';
	import NotificationSilent from '$lib/assets/bell.svelte';
	import NotificationDisabled from '$lib/assets/bell-slash.svelte';
	import NotificationBackground from '$lib/assets/selection-background.svelte';
	import { toastManager } from '$lib/toastStore.svelte';
	import { browser } from '$app/environment';
	import { appSettings, appState } from '$lib/util.svelte';
	import { onMount } from 'svelte';

	let trackingFormValue: string = $state('');
	let trackingNames = appSettings.current.trackingNames;

	async function addTracking(lobbyName: string) {
		if (lobbyName === '') return;

		if (Notification.permission !== 'granted') {
			toastManager.addToast('Requesting notification permissions');
			Notification.requestPermission();
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

	function sendNotification(body: string) {
		new Notification('Rabbit and Steel Partyfinder', {
			body: body,
			icon: `/favicon-96x96.png`,
			silent: appSettings.current.trackingNotifySilent
		});
	}

	// Watch for lobby changes
	$effect(() => {
		const notifyLobbies = appState.newLobbies.filter((l) => trackingNames.includes(l.name));
		if (notificationPermission) {
			if (!appSettings.current.trackingNotifyBackgroundOnly || document.hasFocus()) {
				for (const lobby of notifyLobbies) {
					sendNotification(`Lobby: ${lobby.name} (${lobby.desc})`);
				}
			}
		}
	});

	// Track notification permission status live
	let notificationPermission: NotificationPermission = $state('default');
	onMount(() => {
		notificationPermission = Notification.permission;

		if ('permissions' in navigator) {
			navigator.permissions.query({ name: 'notifications' }).then((notificationPerm) => {
				notificationPerm.onchange = () => {
					notificationPermission = Notification.permission;
				};
			});
		}
	});

	let notificationModalActive = $state(false);

	let collapsed = $state(true);
</script>

<div class="card card-collapsible" class:is-collapsed={collapsed}>
	<header class="card-header">
		<div class="card-header-title is-gap-1">
			<p>Notifications</p>
			{#if notificationPermission === 'granted'}
				<div class="notification-icons" in:fade={{ duration: 200 }}>
					<div class="notification-icon has-text-success is-size-6">
						{#if appSettings.current.trackingNotifySilent}
							<NotificationSilent />
						{:else}
							<NotificationEnabled />
						{/if}
					</div>
					{#if appSettings.current.trackingNotifyBackgroundOnly}
						<div class="notification-icon has-text-info">
							<NotificationBackground />
						</div>
					{/if}
				</div>
			{:else if notificationPermission === 'denied'}
				<div class="notification-icon has-text-danger is-size-6" in:fade={{ duration: 200 }}>
					<NotificationDisabled />
				</div>
			{/if}
		</div>
		<button
			class="button card-header-icon is-size-5"
			aria-label="collapse"
			onclick={() => (notificationModalActive = true)}
		>
			<GearIcon />
		</button>
	</header>
	<div class="card-content">
		{#if trackingNames.length > 0}
			<div class="tracking-tag-list tags" in:fade={{ duration: 200 }}>
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
		{/if}
		<fieldset class="field has-addons">
			<div class="control is-flex-grow-1">
				<input
					type="text"
					placeholder="Lobby name"
					class="input"
					bind:value={trackingFormValue}
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							addTracking(trackingFormValue);
						}
					}}
				/>
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
	<div class="card-footer is-hidden-desktop">
		<button class="card-footer-item collapse-button" onclick={() => (collapsed = !collapsed)}
			><span class="collapse-icon"><CaretUp /></span></button
		>
	</div>
</div>

<Modal bind:active={notificationModalActive}>
	{#snippet header()}
		<p class="card-header-title">Notification Options</p>
	{/snippet}
	{#snippet children()}
		<div class="content">
			<p>
				Notifications permission status:
				{#if notificationPermission === 'granted'}
					<span class="has-text-success">Granted</span>
				{:else if notificationPermission === 'default'}
					<span class="has-text-warning">Default</span>
				{:else if notificationPermission === 'denied'}
					<span class="has-text-danger">Denied</span>
				{/if}
			</p>
		</div>
		<div class="field">
			<label class="checkbox"
				><input type="checkbox" bind:checked={appSettings.current.trackingNotifySilent} /> Silent notifications</label
			>
			<p class="is-size-7">Effects depend on your device.</p>
		</div>
		<div class="field">
			<label class="checkbox"
				><input type="checkbox" bind:checked={appSettings.current.trackingNotifyBackgroundOnly} /> Notify
				in only background</label
			>
			<p class="is-size-7">Only send notifications if this window is not in focus.</p>
		</div>
	{/snippet}
</Modal>

<style>
	.notification-icons {
		display: flex;
		gap: 0.25rem;
	}

	.notification-icon {
		display: flex;
		align-items: center;
	}

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
