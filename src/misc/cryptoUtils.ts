const PBKDF2_ITERATIONS = 600000;
const API_KEY_LOCAL_STORAGE_KEY = 'apiKey';

interface EncryptedPayload
{
	salt: string;
	iv: string;
	ciphertext: string;
	iterations: number;	// stored per-blob so the default could be bumped later
}

const bufToBase64 = (buf: ArrayBuffer): string => btoa(String.fromCharCode(...new Uint8Array(buf)));
const base64ToBuf = (b64: string): ArrayBuffer => Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;

const deriveKey = async (passphrase: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> =>
{
	const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);

	return crypto.subtle.deriveKey(
		{ name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']);
}

export const encryptAndStoreToken = async (apiKey: string, passphrase: string): Promise<void> =>
{
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const key = await deriveKey(passphrase, salt);

	const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(apiKey));

	const payload: EncryptedPayload =
	{
		salt: bufToBase64(salt.buffer),
		iv: bufToBase64(iv.buffer),
		ciphertext: bufToBase64(ciphertext),
		iterations: PBKDF2_ITERATIONS,
	};

	localStorage.setItem(API_KEY_LOCAL_STORAGE_KEY, JSON.stringify(payload));
}

export const decryptStoredToken = async (passphrase: string): Promise<string | null> =>
{
	const raw = localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY);
	if (!raw) return null;

	const payload: EncryptedPayload = JSON.parse(raw);
	const salt = new Uint8Array(base64ToBuf(payload.salt));
	const iv = new Uint8Array(base64ToBuf(payload.iv));
	const key = await deriveKey(passphrase, salt);

	try
	{
		const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBuf(payload.ciphertext));
		return new TextDecoder().decode(decrypted);
	}
	catch
	{
		// wrong passphrase, or corrupted/tampered data - AES-GCM auth fails
		return null;
	}
}

export const clearStoredToken = () => localStorage.removeItem(API_KEY_LOCAL_STORAGE_KEY);
export const hasStoredToken = (): boolean => localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY) !== null;