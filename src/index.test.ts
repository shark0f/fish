import { test, assert } from 'vitest';
import { Fish } from './index';

test('Basic test', () => {
	const text = 'hello world!';
	const fish = new Fish('1');

	const encrypted = fish.encrypt(text);
	assert.equal(encrypted, 'fbdeaaa1cca0fda029094196');

	const decrypted = fish.decrypt(encrypted);
	assert.equal(decrypted, text);
});

test('Different key sizes', () => {
	for (const size of [16, 24, 32] as const) {
		const text = 'hello world!';
		const fish = new Fish('1', {
			pbkdf: {
				size,
			},
		});

		const encrypted = fish.encrypt(text);
		const decrypted = fish.decrypt(encrypted);
		assert.equal(decrypted, text);
	}
});

test('Different salt options', () => {
	const text = 'hello world!';
	const password = '1';
	const fish1 = new Fish(password);
	const fish2 = new Fish(password, { pbkdf: { salt: 'lol' } });

	const encrypted1 = fish1.encrypt(text);
	const encrypted2 = fish2.encrypt(text);

	const decrypted1 = fish1.decrypt(encrypted1);
	assert.equal(decrypted1, text);

	const decrypted2 = fish2.decrypt(encrypted2);
	assert.equal(decrypted2, text);
});

test('A lot of text', () => {
	const text = 'hello world!'.repeat(1e4);
	const fish = new Fish('1234567890'.repeat(1e4));

	const encrypted = fish.encrypt(text);
	const decrypted = fish.decrypt(encrypted);
	assert.equal(decrypted, text);
});
