import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { Lobby } from '$lib';

export function bytesToInt(bytes: Uint8Array<ArrayBuffer>) {
	let value = 0;

	for (let i = 0; i < bytes.length; i++) {
		value = value * 256 + bytes[i];
	}

	return value;
}

type StreamChunk = {
	id: number;
	size: number;
	data: Lobby[];
};

type StreamOptions = {
	uncensored: boolean;
};

let currentStream: ReadableStream | null = null;
let aborter: AbortController | null = null;

export async function connectStream(
	options: StreamOptions,
	callback: (chunk: StreamChunk | null) => void
) {
	if (currentStream) {
		await currentStream.cancel('Change in settings');
		currentStream = null;
	}

	aborter = new AbortController();
	const url = new URL(
		`/lobbies/stream?format=json&modified=true&unfiltered=${options.uncensored === true ? 'true' : 'false'}`,
		PUBLIC_API_ENDPOINT
	);
	const stream = await fetch(url, { signal: aborter.signal }).then((response) => {
		const reader = response.body?.getReader();
		if (reader === undefined) {
			console.error('Unable to get reader');
			return;
		}
		return new ReadableStream({
			start(controller) {
				return pump();
				function pump(): Promise<Function | undefined> | undefined {
					return reader?.read().then(({ done, value }) => {
						if (value) {
							let id = bytesToInt(value.slice(0, 4));
							let size = bytesToInt(value.slice(4, 6));
							let payload = new TextDecoder().decode(value.slice(6, 6 + size));

							// Heartbeats counted as a null payload
							if (size !== 0) {
								let parsedPayload = null;
								try {
									parsedPayload = JSON.parse(payload);
								} catch (error) {
									console.error(error);
								}

								if (parsedPayload !== null) {
									const chunk: StreamChunk = {
										id: id,
										size: size,
										data: parsedPayload
									};

									callback(chunk);
								}
							} else {
								callback(null);
							}
						}

						if (done) {
							controller.close();
							return;
						}

						return pump();
					});
				}
			},
			cancel(reason) {
				console.log('Closed stream. Reason:', reason);
				aborter?.abort();
			}
		});
	});

	if (stream instanceof ReadableStream) {
		currentStream = stream;
	}

	return stream;
}
