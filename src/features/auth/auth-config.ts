import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';

function requireEnv(name: string): string {
  const env = import.meta.env as Record<string, string | undefined>;
  const value = env[name];
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const keycloakConfig: KeycloakConfig = {
  url: requireEnv('VITE_KEYCLOAK_URL'),
  realm: requireEnv('VITE_KEYCLOAK_REALM'),
  clientId: requireEnv('VITE_KEYCLOAK_CLIENT_ID'),
};

export const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: 'check-sso',
  pkceMethod: 'S256',
  checkLoginIframe: false,
};
