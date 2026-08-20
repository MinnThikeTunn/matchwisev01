/**
 * Anonymous device identity.
 *
 * Every visitor gets a random secret token stored in localStorage. The server
 * stores only a hash of it and uses it to authorize writes to that visitor's
 * cloud profile. No sign-in required.
 */
const DEVICE_TOKEN_KEY = 'matchwise_device_token';
const DEVICE_PROFILE_ID_KEY = 'matchwise_device_profile_id';

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export function getDeviceToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    const existing = localStorage.getItem(DEVICE_TOKEN_KEY);
    if (existing && existing.length >= 32) return existing;
    const token = randomToken();
    localStorage.setItem(DEVICE_TOKEN_KEY, token);
    return token;
  } catch {
    return '';
  }
}

export function getStoredProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(DEVICE_PROFILE_ID_KEY);
  } catch {
    return null;
  }
}

export function storeProfileId(id: string): void {
  try {
    localStorage.setItem(DEVICE_PROFILE_ID_KEY, id);
  } catch {
    /* ignore */
  }
}
