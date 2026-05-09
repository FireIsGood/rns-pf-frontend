<script lang="ts">
	import { toastManager } from './toastStore.svelte';
	import Toast from './Toast.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
</script>

<ul class="toast-manager">
	{#each toastManager.toasts as toast (toast.id)}
		<li
			animate:flip={{ duration: 200 }}
			in:fly={{ duration: 200, x: -20 }}
			out:fly={{ duration: 200, x: -20 }}
		>
			<Toast {toast} />
		</li>
	{/each}
</ul>

<style>
	ul {
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.75rem;
		bottom: 1em;
		right: 1em;
		z-index: 10;
	}
</style>
