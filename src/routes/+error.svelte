<script lang="ts">
	import { page } from '$app/state';
</script>

<section class="hero is-large has-text-centered">
	<div class="hero-body">
		<h2 class="title is-1">{page.status}</h2>
		<h3 class="subtitle">{page.error?.message}</h3>
		<p><a href="/">Return to home</a></p>
	</div>
</section>
