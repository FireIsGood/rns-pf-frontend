<script lang="ts">
	import CopyIcon from '$lib/assets/copy.svelte';
	import CheckIcon from '$lib/assets/check.svelte';
	import { copyText } from '$lib/util.svelte';

	let { text }: { text: string } = $props();

	type CopyStatus = 'copied' | 'waiting';
	let copyStatus: CopyStatus = $state('waiting');

	let copyTimeout: NodeJS.Timeout;

	function handleCopy() {
		copyText(text);
		copyStatus = 'copied';

		clearTimeout(copyTimeout);
		copyTimeout = setTimeout(() => {
			copyStatus = 'waiting';
		}, 1000);
	}
</script>

<button class="copy-button ml-auto" onclick={handleCopy}>
	<span class="icon">
		{#if copyStatus === 'copied'}
			<CheckIcon />
		{:else}
			<CopyIcon />
		{/if}
	</span>
</button>

<style>
	.copy-button {
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
</style>
