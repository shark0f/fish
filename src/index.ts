import * as aesjs from 'aes-js';
import { syncScrypt } from 'scrypt-js';

export interface FishOptions {
	/**
	 * Settings for the password-base key derivation function implementation.
	 */
	pbkdf?: {
		/**
		 * Random data that is used as an additional input.
		 * @default ""
		 */
		salt?: string;
		/**
		 * The CPU/memory cost; increasing this increases the overall difficulty.
		 * @default 1024
		 */
		N?: number;
		/**
		 * The block size; increasing this increases the dependency on memory latency and bandwidth.
		 * @default 8
		 */
		r?: number;
		/**
		 * The parallelization cost; increasing this increases the dependency on multi-processing.
		 * @default 2
		 */
		p?: number;
		/**
		 * The key size.
		 * @default 32
		 */
		size?: 16 | 24 | 32;
	};
}

export class Fish {
	private key: Uint8Array;

	constructor(password: string, options: FishOptions = {}) {
		const textEncoder = new TextEncoder();

		this.key = syncScrypt(
			textEncoder.encode(password),
			textEncoder.encode(options.pbkdf?.salt),
			options.pbkdf?.N ?? 1024,
			options.pbkdf?.r ?? 8,
			options.pbkdf?.p ?? 2,
			options.pbkdf?.size ?? 32,
		);
	}

	public encrypt(text: string): string {
		const ctr = new aesjs.ModeOfOperation.ctr(this.key);

		return aesjs.utils.hex.fromBytes(
			ctr.encrypt(aesjs.utils.utf8.toBytes(text)),
		);
	}

	public decrypt(encryptedHex: string) {
		const ctr = new aesjs.ModeOfOperation.ctr(this.key);

		return aesjs.utils.utf8.fromBytes(
			ctr.decrypt(aesjs.utils.hex.toBytes(encryptedHex)),
		);
	}
}
