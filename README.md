# @shark0f/fish

A simple AES encryption library.

## Usage

```typescript
const fish = new Fish('A_SUPER_SAFE_STRING');
const text = 'Hello, World';

const encrypted = fish.encrypt(text); // 1a4f1d4fa6617e63cc79159e
const decrypted = fish.decrypt(encrypted); // Hello, World
```
