class Tracking {
	trackingNames = $state<string[]>([]);
	silentNotify = $state<boolean>(false);

	constructor() {
		if (typeof localStorage === 'undefined') return;
		const storedTracking = localStorage.getItem('tracking');
		let newTracking = [];

		// Copy from storage, checking that it is an array-like
		if (storedTracking) {
			const parsedTracking = JSON.parse(storedTracking);
			if (Array.isArray(parsedTracking)) {
				newTracking = parsedTracking;
			}
		}

		this.trackingNames = newTracking;

		// Sync silent notify
		const storedNotify = localStorage.getItem('silentNotify') === 'true';
		this.silentNotify = storedNotify ?? false;
	}

	async addTracking(lobbyName: string) {
		this.trackingNames.push(lobbyName);

		this.syncLocalstorage();
	}

	removeTracking(lobbyName: string) {
		const index = this.trackingNames.indexOf(lobbyName);
		if (index > -1) {
			this.trackingNames.splice(index, 1);
		} else {
			console.error(`Tried to remove tracking of ${lobbyName} but it was not being tracked.`);
		}

		this.syncLocalstorage();
	}

	private syncLocalstorage() {
		localStorage.setItem('tracking', JSON.stringify(this.trackingNames));
	}
}

export const tracking = new Tracking();

export function typewriter(node: HTMLElement, { speed = 1 }: { speed?: number }) {
	const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

	if (!valid) {
		throw new Error(`This transition only works on elements with a single text node child`);
	}

	const text = node.textContent;
	const duration = text.length / (speed * 0.01);

	return {
		duration,
		tick: (t: number) => {
			const i = Math.trunc(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};
}
