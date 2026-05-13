<script lang="ts">
	import XIcon from '$lib/assets/x.svelte';
	import type { Snippet } from 'svelte';

	let {
		active = $bindable(false),
		children,
		header,
		disableDismiss = false
	}: { active: boolean; children: Snippet; header: Snippet; disableDismiss?: boolean } = $props();
</script>

<div class="modal" class:is-active={active}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- Mouse users only: Allow clicking on the background to close -->
	<div
		class="modal-background"
		onclick={() => {
			active = false;
		}}
	></div>
	<div class="modal-content">
		<div class="card">
			<header class="card-header">
				{@render header()}
				<button
					class="button card-header-icon is-size-5"
					aria-label="close"
					onclick={() => {
						if (!disableDismiss) {
							active = false;
						}
					}}
				>
					<XIcon />
				</button>
			</header>
			<div class="card-content">
				{@render children()}
			</div>
		</div>
	</div>
</div>
