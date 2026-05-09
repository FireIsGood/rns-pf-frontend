type ToastId = ReturnType<typeof crypto.randomUUID>;
export type ToastSingle = {
	id: ToastId;
	message: string;
	type: ToastType;
	duration: number;
	timeout: NodeJS.Timeout;
};

type ToastType = 'info' | 'success' | 'warn';

class Toasts {
	toasts = $state<ToastSingle[]>([]);

	constructor() {}

	addToast(message: string, type: ToastType = 'info', duration: number = 5000) {
		const id = crypto.randomUUID();
		const timeout = setTimeout(() => {
			this.removeToast(id);
		}, duration);

		this.toasts.push({
			id,
			message,
			type,
			duration,
			timeout
		});

		return id;
	}

	removeToast(id: ToastId) {
		const index = this.toasts.findIndex((t) => t.id === id);
		if (index > -1) {
			this.toasts.splice(index, 1);
		}
	}
}

export const toastManager = new Toasts();
