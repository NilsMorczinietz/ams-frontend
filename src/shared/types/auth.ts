import type { KeycloakTokenParsed } from 'keycloak-js';

export interface KeycloakIdTokenClaims extends KeycloakTokenParsed {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
}
