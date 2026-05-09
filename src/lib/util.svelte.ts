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
	}

	async addTracking(lobbyName: string) {
		this.trackingNames.push(lobbyName);
		console.log('Tracked', lobbyName);

		this.syncLocalstorage();
	}

	removeTracking(lobbyName: string) {
		const index = this.trackingNames.indexOf(lobbyName);
		if (index > -1) {
			this.trackingNames.splice(index, 1);
		} else {
			console.error(`Tried to remove tracking of ${lobbyName} but it was not being tracked.`);
		}
	}

	private syncLocalstorage() {
		localStorage.setItem('tracking', JSON.stringify(this.trackingNames));
	}
}

export const tracking = new Tracking();
