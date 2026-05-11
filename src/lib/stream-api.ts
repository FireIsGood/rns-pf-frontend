import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { Lobby } from '$lib';

export function bytesToInt(bytes: Uint8Array<ArrayBuffer>) {
	let value = 0;

	for (let i = 0; i < bytes.length; i++) {
		value = value * 256 + bytes[i];
	}

	return value;
}

export enum ChangeKind {
	ADD = 0,
	UPDATE = 1,
	REMOVE = 2
}

type LobbyChange = Partial<Lobby> & {
	kind?: ChangeKind;
};

function deserializeChunkChanges(bytes: Uint8Array<ArrayBuffer>): LobbyChange[] {
	if (!bytes.length) {
		return [];
	}

	let changes = [];

	while (bytes.length) {
		let op = bytesToInt(bytes.slice(0, 1));
		let id = bytesToInt(bytes.slice(1, 9));

		let change: LobbyChange = { id: id.toString() };
		bytes = bytes.slice(9);

		if (op == 43) {
			// + = 43
			change.kind = ChangeKind.ADD;

			let name_size = bytesToInt(bytes.slice(0, 2));
			bytes = bytes.slice(2);

			change.name = new TextDecoder().decode(bytes.slice(0, name_size));
			bytes = bytes.slice(name_size);

			let desc_size = bytesToInt(bytes.slice(0, 2));
			bytes = bytes.slice(2);

			change.desc = new TextDecoder().decode(bytes.slice(0, desc_size));
			bytes = bytes.slice(desc_size);

			change.difficulty = bytesToInt(bytes.slice(0, 1));
			bytes = bytes.slice(1);

			change.password_locked = bytesToInt(bytes.slice(0, 1)) === 1;
			bytes = bytes.slice(1);

			change.player_num = bytesToInt(bytes.slice(0, 1));
			bytes = bytes.slice(1);

			change.member_num = bytesToInt(bytes.slice(0, 1));
			bytes = bytes.slice(1);

			change.max_players = bytesToInt(bytes.slice(0, 1));
			bytes = bytes.slice(1);

			change.stage_first = bytesToInt(bytes.slice(0, 1));
			bytes = bytes.slice(1);

			change.disbanded = bytesToInt(bytes.slice(0, 1)) === 1;
			bytes = bytes.slice(1);

			change.modded = bytesToInt(bytes.slice(0, 1)) === 1;
			bytes = bytes.slice(1);

			change.language = bytesToInt(bytes.slice(0, 1));
			bytes = bytes.slice(1);

			change.lobby_type = bytesToInt(bytes.slice(0, 1));
			bytes = bytes.slice(1);

			let byte = bytesToInt(bytes.slice(0, 1));
			if (byte == 255) {
				change.char0 = null;
			} else {
				change.char0 = byte;
			}
			bytes = bytes.slice(1);

			byte = bytesToInt(bytes.slice(0, 1));
			if (byte == 255) {
				change.palette0 = null;
			} else {
				change.palette0 = byte;
			}
			bytes = bytes.slice(1);

			byte = bytesToInt(bytes.slice(0, 1));
			if (byte == 255) {
				change.char1 = null;
			} else {
				change.char1 = byte;
			}
			bytes = bytes.slice(1);

			byte = bytesToInt(bytes.slice(0, 1));
			if (byte == 255) {
				change.palette1 = null;
			} else {
				change.palette1 = byte;
			}
			bytes = bytes.slice(1);

			byte = bytesToInt(bytes.slice(0, 1));
			if (byte == 255) {
				change.char2 = null;
			} else {
				change.char2 = byte;
			}
			bytes = bytes.slice(1);

			byte = bytesToInt(bytes.slice(0, 1));
			if (byte == 255) {
				change.palette2 = null;
			} else {
				change.palette2 = byte;
			}
			bytes = bytes.slice(1);

			byte = bytesToInt(bytes.slice(0, 1));
			if (byte == 255) {
				change.char3 = null;
			} else {
				change.char3 = byte;
			}
			bytes = bytes.slice(1);

			byte = bytesToInt(bytes.slice(0, 1));
			if (byte == 255) {
				change.palette3 = null;
			} else {
				change.palette3 = byte;
			}
			bytes = bytes.slice(1);

			change.client_num = bytesToInt(bytes.slice(0, 4));
			bytes = bytes.slice(4);

			change.list_mode = bytesToInt(bytes.slice(0, 4));
			bytes = bytes.slice(4);

			change.online_version = bytesToInt(bytes.slice(0, 4));
			bytes = bytes.slice(4);

			changes.push(change);
		} else if (op == 42) {
			// * = 42
			change.kind = ChangeKind.UPDATE;

			while (bytes.length) {
				let key = bytesToInt(bytes.slice(0, 1));
				bytes = bytes.slice(1);

				if (key == 62) {
					// > = 62
					break;
				} else if (key == 78) {
					// N = 78
					let name_size = bytesToInt(bytes.slice(0, 2));
					bytes = bytes.slice(2);

					change.name = new TextDecoder().decode(bytes.slice(0, name_size));
					bytes = bytes.slice(name_size);
				} else if (key == 68) {
					// D = 68
					let desc_size = bytesToInt(bytes.slice(0, 2));
					bytes = bytes.slice(2);

					change.desc = new TextDecoder().decode(bytes.slice(0, desc_size));
					bytes = bytes.slice(desc_size);
				} else if (key == 100) {
					// d = 100
					change.difficulty = bytesToInt(bytes.slice(0, 1));
					bytes = bytes.slice(1);
				} else if (key == 80) {
					// P = 80
					change.password_locked = bytesToInt(bytes.slice(0, 1)) === 1;
					bytes = bytes.slice(1);
				} else if (key == 110) {
					// n = 110
					change.player_num = bytesToInt(bytes.slice(0, 1));
					bytes = bytes.slice(1);
				} else if (key == 109) {
					// m = 109
					change.member_num = bytesToInt(bytes.slice(0, 1));
					bytes = bytes.slice(1);
				} else if (key == 77) {
					// M = 77
					change.max_players = bytesToInt(bytes.slice(0, 1));
					bytes = bytes.slice(1);
				} else if (key == 83) {
					// S = 83
					change.stage_first = bytesToInt(bytes.slice(0, 1));
					bytes = bytes.slice(1);
				} else if (key == 63) {
					// ? = 63
					change.disbanded = bytesToInt(bytes.slice(0, 1)) === 1;
					bytes = bytes.slice(1);
				} else if (key == 94) {
					// ^ = 94
					change.modded = bytesToInt(bytes.slice(0, 1)) === 1;
					bytes = bytes.slice(1);
				} else if (key == 76) {
					// L = 76
					change.language = bytesToInt(bytes.slice(0, 1));
					bytes = bytes.slice(1);
				} else if (key == 84) {
					// T = 84
					change.lobby_type = bytesToInt(bytes.slice(0, 1));
					bytes = bytes.slice(1);
				} else if (key == 48) {
					// 0 = 48
					let byte = bytesToInt(bytes.slice(0, 1));

					if (byte == 255) {
						change.char0 = null;
					} else {
						change.char0 = byte;
					}

					bytes = bytes.slice(1);
				} else if (key == 41) {
					// ) = 41
					let byte = bytesToInt(bytes.slice(0, 1));

					if (byte == 255) {
						change.palette0 = null;
					} else {
						change.palette0 = byte;
					}

					bytes = bytes.slice(1);
				} else if (key == 49) {
					// 1 = 49
					let byte = bytesToInt(bytes.slice(0, 1));

					if (byte == 255) {
						change.char1 = null;
					} else {
						change.char1 = byte;
					}

					bytes = bytes.slice(1);
				} else if (key == 33) {
					// ! = 41
					let byte = bytesToInt(bytes.slice(0, 1));

					if (byte == 255) {
						change.palette1 = null;
					} else {
						change.palette1 = byte;
					}

					bytes = bytes.slice(1);
				} else if (key == 50) {
					// 2 = 50
					let byte = bytesToInt(bytes.slice(0, 1));

					if (byte == 255) {
						change.char2 = null;
					} else {
						change.char2 = byte;
					}

					bytes = bytes.slice(1);
				} else if (key == 64) {
					// @ = 64
					let byte = bytesToInt(bytes.slice(0, 1));

					if (byte == 255) {
						change.palette2 = null;
					} else {
						change.palette2 = byte;
					}

					bytes = bytes.slice(1);
				} else if (key == 51) {
					// 3 = 51
					let byte = bytesToInt(bytes.slice(0, 1));

					if (byte == 255) {
						change.char3 = null;
					} else {
						change.char3 = byte;
					}

					bytes = bytes.slice(1);
				} else if (key == 35) {
					// # = 35
					let byte = bytesToInt(bytes.slice(0, 1));

					if (byte == 255) {
						change.palette3 = null;
					} else {
						change.palette3 = byte;
					}

					bytes = bytes.slice(1);
				} else if (key == 99) {
					// c = 99
					change.client_num = bytesToInt(bytes.slice(0, 4));
					bytes = bytes.slice(4);
				} else if (key == 108) {
					// l = 108
					change.list_mode = bytesToInt(bytes.slice(0, 4));
					bytes = bytes.slice(4);
				} else if (key == 118) {
					// c = 118
					change.online_version = bytesToInt(bytes.slice(0, 4));
					bytes = bytes.slice(4);
				} else {
					console.error('Invalid chunk key', key);
					return [];
				}

				changes.push(change);
			}
		} else {
			// - = 45
			change.kind = ChangeKind.REMOVE;

			changes.push(change);
		}
	}

	return changes;
}

type StreamChunk = {
	id: number;
	size: number;
	data: LobbyChange[];
};

type StreamOptions = {
	uncensored: boolean;
};

let currentStream: ReadableStream | null = null;
let aborter: AbortController | null = null;

export async function connectStream(
	options: StreamOptions,
	onPacket: (chunk: StreamChunk | null) => void,
	onPacketError: () => void
) {
	if (currentStream) {
		await currentStream.cancel('Stream replaced');
		currentStream = null;
	}

	aborter = new AbortController();
	const url = new URL(
		`/lobbies/stream?format=chunk_changes&modified=true&unfiltered=${options.uncensored === true ? 'true' : 'false'}`,
		PUBLIC_API_ENDPOINT
	);
	const stream = await fetch(url, { signal: aborter.signal }).then((response) => {
		const reader = response.body?.getReader();
		if (reader === undefined) {
			console.error('Unable to get reader');
			return;
		}

		let prev_id = 0;

		return new ReadableStream({
			start(controller) {
				return pump();
				function pump(): Promise<Function | undefined> | undefined {
					return reader?.read().then(({ done, value }) => {
						if (value) {
							let id = bytesToInt(value.slice(0, 4));
							let size = bytesToInt(value.slice(4, 6));
							let data = value.slice(6, 6 + size);

							if (id - prev_id > 1) {
								console.error('Missed a change, closing to reset data');
								controller.close();
								onPacketError();
								return;
							}

							prev_id = id;

							// Heartbeats counted as a null payload
							if (size !== 0) {
								let parsedPayload = null;
								try {
									parsedPayload = deserializeChunkChanges(data);
								} catch (error) {
									console.error(error);
								}

								if (parsedPayload !== null) {
									const chunk: StreamChunk = {
										id: id,
										size: size,
										data: parsedPayload
									};

									onPacket(chunk);
								}
							} else {
								onPacket(null);
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
				console.log('Closed stream for reason:', reason);
				aborter?.abort();
			}
		});
	});

	if (stream instanceof ReadableStream) {
		currentStream = stream;
	}

	return stream;
}
