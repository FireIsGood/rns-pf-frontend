<script lang="ts">
	import type { Lobby } from '$lib';
	import { tracking } from '$lib/util.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

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
</script>

<p class="subtitle has-text-centered">Notifications</p>
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
				onclick={() => removeTracking(name)}>&times;</button
			>
		</span>
	{/each}
</div>
<fieldset class="field has-addons">
	<div class="control">
		<input type="text" placeholder="Lobby name" class="input" bind:value={trackingFormValue} />
	</div>
	<div class="control">
		<button class="button is-primary is-soft" onclick={() => addTracking(trackingFormValue)}
			>Add Tracking</button
		>
	</div>
</fieldset>

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
