import { getAccessToken } from '@features/auth/keycloak-client';
import { ApiHttpError } from './api-error';

const API_PREFIX = '/api/';
const originalFetch = window.fetch.bind(window);
let isInstalled = false;

function isApiRequest(input: RequestInfo | URL): boolean {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  return (
    url.startsWith(API_PREFIX) ||
    url.startsWith(`${window.location.origin}${API_PREFIX}`)
  );
}

export function installAuthenticatedApiFetch(): void {
  if (isInstalled) {
    return;
  }

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (!isApiRequest(input)) {
      return originalFetch(input, init);
    }

    const headers = new Headers(init?.headers);

    if (!headers.has('Authorization')) {
      const token = await getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const response = await originalFetch(input, {
      ...init,
      headers,
    });

    if (!response.ok) {
      throw await ApiHttpError.fromResponse(response);
    }

    return response;
  };

  isInstalled = true;
}
