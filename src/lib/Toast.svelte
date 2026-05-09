<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { toastManager, type ToastSingle } from './toastStore.svelte';
	import { onMount } from 'svelte';
	let { toast }: { toast: ToastSingle } = $props();
	onMount(() => {
		progress.set(1);
	});
	let progress = new Tween(0, { duration: () => toast.duration });
</script>

<div class={['toast', toast.type]}>
	<span role="status">
		{toast.message}
	</span>
	<button
		class="close-button p-1 has-text-danger"
		onclick={() => {
			toastManager.removeToast(toast.id);
		}}>&times;</button
	>
	<progress class="toast-progress progress is-radiusless" max="1" value={progress.current}
		>hi</progress
	>
</div>

<style>
	.toast {
		--toast-color: hsl(
			var(--bulma-scheme-h),
			var(--bulma-scheme-s),
			var(--bulma-scheme-main-ter-l)
		);
		--progress-color: hsl(var(--bulma-scheme-h), var(--bulma-scheme-s), var(--bulma-text-l));
		--progress-height: 2px;

		position: relative;
		padding: 0.5rem 0.75rem calc(0.5rem + var(--progress-height));
		border-radius: 0.5em;
		border: 1px solid;
		border-color: hsl(
			var(--bulma-primary-h),
			var(--bulma-scheme-s),
			calc(var(--bulma-scheme-main-l) + var(--bulma-active-border-l-delta))
		);
		background-color: var(--toast-color);
		overflow: clip;
	}

	.warn {
		--toast-color: hsl(
			var(--bulma-danger-h),
			var(--bulma-scheme-s),
			calc(var(--bulma-scheme-main-l) + 15% * sign(var(--bulma-active-border-l-delta)))
		);
		--progress-color: hsl(var(--bulma-danger-h), var(--bulma-scheme-s), var(--bulma-text-l));
	}
	.success {
		--toast-color: hsl(
			var(--bulma-success-h),
			var(--bulma-scheme-s),
			calc(var(--bulma-scheme-main-l) + 15% * sign(var(--bulma-active-border-l-delta)))
		);
		--progress-color: hsl(var(--bulma-success-h), var(--bulma-scheme-s), var(--bulma-text-l));
	}
	.info {
		--toast-color: hsl(
			var(--bulma-info-h),
			var(--bulma-scheme-s),
			calc(var(--bulma-scheme-main-l) + 15% * sign(var(--bulma-active-border-l-delta)))
		);
		--progress-color: hsl(var(--bulma-info-h), var(--bulma-scheme-s), var(--bulma-text-l));
	}

	.close-button {
		&:hover {
			color: hsl(
				var(--bulma-text-h),
				var(--bulma-text-s),
				calc(var(--bulma-text-l) + var(--bulma-hover-background-l-delta))
			);
		}
		&:active {
			color: hsl(
				var(--bulma-text-h),
				var(--bulma-text-s),
				calc(var(--bulma-text-l) + var(--bulma-active-background-l-delta))
			);
		}
	}

	.toast-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		display: block;

		height: var(--progress-height);
		--bulma-progress-value-background-color: var(--progress-color);
	}
</style>
