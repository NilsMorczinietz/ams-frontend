import { createContext, use } from 'react';
import type { KeycloakTokenParsed } from 'keycloak-js';

export interface AuthContextValue {
  isAuthenticated: boolean;
  isInitialized: boolean;
  tokenParsed: KeycloakTokenParsed | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
