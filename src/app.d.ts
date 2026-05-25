// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// vite.config.js
	declare const __GIT_TAG__: string;
	declare const __GIT_HASH__: string;
	declare const __BUILD_DATE__: string;
}

export {};
