import Keycloak from 'keycloak-js';
import { keycloakConfig, keycloakInitOptions } from './auth-config';

export const keycloak = new Keycloak(keycloakConfig);

let initPromise: Promise<boolean> | null = null;

export function initializeKeycloak(): Promise<boolean> {
  if (!initPromise) {
    initPromise = keycloak
      .init({
        ...keycloakInitOptions,
        redirectUri: window.location.origin,
      })
      .then((authenticated) => {
        if (authenticated && keycloak.token) {
          // console.log(keycloak.token);
        }

        return authenticated;
      });
  }

  return initPromise;
}

export async function getAccessToken(
  minValiditySeconds = 30
): Promise<string | undefined> {
  if (!keycloak.authenticated) {
    return undefined;
  }

  try {
    await keycloak.updateToken(minValiditySeconds);
    return keycloak.token;
  } catch {
    return undefined;
  }
}

export function login(): Promise<void> {
  return keycloak.login({ redirectUri: window.location.origin });
}

export function logout(): Promise<void> {
  return keycloak.logout({ redirectUri: window.location.origin });
}
