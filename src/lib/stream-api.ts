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

export async function connectStream(callback: (chunk: StreamChunk) => void) {
	const stream = await fetch(`${PUBLIC_API_ENDPOINT}/lobbies/stream?format=json`).then(
		(response) => {
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

								// Filter heartbeats out
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
								}
							}

							if (done) {
								console.log('Connection called a done method');
								controller.close();
								return;
							}

							controller.enqueue(value);
							return pump();
						});
					}
				},
				cancel(reason) {
					console.log('Connection closed, reason:', reason);
				}
			});
		}
	);

	return stream;
}

export {};
