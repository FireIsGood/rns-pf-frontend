<script lang="ts">
	import { appSettings, appState, degToRad, turnToRad } from '$lib/util.svelte';
	import { onMount } from 'svelte';
	import { Canvas, Layer, type Render } from 'svelte-canvas';

	let canvas: Canvas;

	// Square sizes
	const squareSize = 150;
	const squareWidth = 3;
	const squareGlowWidth = 8;
	const squareOrigin = { x: 0.65, y: 0.475 };
	const squareAngle = degToRad(35);
	const squareZoomLoopDuration = 20_000;
	const squareSpinLoopDuration = 44_000 * 4;

	// Library has an issue sometimes

	const renderSquares: Render = ({ context: ctx, time }) => {
		const width = canvas.canvas.width;
		const height = canvas.canvas.height;
		const squareColor = getComputedStyle(ctx.canvas).getPropertyValue('--square-color');
		const squareShadowColor = getComputedStyle(ctx.canvas).getPropertyValue(
			'--square-shadow-color'
		);

		ctx.resetTransform();
		ctx.reset();

		// Rectangles
		const rectCount = Math.ceil(width / squareSize);
		ctx.save();
		ctx.strokeStyle = squareColor;
		ctx.shadowColor = squareShadowColor;
		ctx.shadowBlur = squareGlowWidth;
		ctx.lineWidth = squareWidth;
		for (let _i = -1; _i < rectCount; _i++) {
			ctx.resetTransform();
			const i = _i + ((time / squareZoomLoopDuration) % 1);
			const size = squareSize * Math.pow(1.8, i - 1);

			// Alpha
			ctx.globalAlpha = Math.min(0.25, Math.max(0, i * 0.125 + 0.125));

			// Translate
			ctx.translate(-i * (squareSize / 10), 0);

			// Offset rotation
			const off = { x: width * squareOrigin.x, y: height * squareOrigin.y };
			ctx.translate(off.x, off.y);
			ctx.rotate(squareAngle);
			ctx.rotate(-turnToRad(time / squareSpinLoopDuration));
			ctx.translate(-off.x, -off.y);

			// Draw
			ctx.strokeRect(off.x - size / 2, off.y - size / 2, size, size);
		}
		ctx.restore();
	};

	let loaded = $state(false);
	onMount(() => {
		loaded = true;
	});
</script>

<Canvas
	autoplay={appSettings.current.animateBackground}
	class={['background-canvas', loaded && 'loaded']}
	bind:this={canvas}
>
	<Layer render={renderSquares} />
</Canvas>

<style>
	:global(.background-canvas) {
		position: fixed;
		inset: 0;
		z-index: -1000;
		/* z-index: 1000; */
		max-width: 100%;
		max-height: 100%;
		pointer-events: none;

		&.loaded {
			animation: fade-in 1600ms ease-out;
		}

		/* Used in canvas JS */
		--square-color: hsl(
			var(--bulma-primary-h) calc(var(--bulma-primary-s) + 10%)
				calc(var(--bulma-soft-l) + 15% * sign(var(--bulma-active-border-l-delta)))
		);
		--square-shadow-color: hsl(
			var(--bulma-primary-h) calc(var(--bulma-primary-s) + 40%)
				calc(var(--bulma-soft-l) + 50% * sign(var(--bulma-active-border-l-delta)))
		);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
