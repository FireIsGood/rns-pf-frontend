<script lang="ts">
	import XIcon from '$lib/assets/x.svelte';
	import type { Snippet } from 'svelte';

	let {
		active = $bindable(false),
		children,
		header
	}: { active: boolean; children: Snippet; header: Snippet } = $props();
</script>

<div class="modal" class:is-active={active}>
	<div class="modal-background"></div>
	<div class="modal-content">
		<div class="card">
			<header class="card-header">
				{@render header()}
				<button
					class="button card-header-icon is-size-5"
					aria-label="close"
					onclick={() => (active = false)}
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
