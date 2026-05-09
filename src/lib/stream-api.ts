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

// Connects a stream. Does not return until the stream breaks somehow.
export async function connectStream(callback: (chunk: StreamChunk | null) => void) {
	const stream = await fetch(
		`${PUBLIC_API_ENDPOINT}/lobbies/stream?format=json&modified=true&uncensored=true`
	).then((response) => {
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
							console.log('Connection called a done method');
							controller.close();
							return;
						}

						return pump();
					});
				}
			},
			cancel(reason) {
				console.log('Connection closed, reason:', reason);
			}
		});
	});

	return stream;
}
