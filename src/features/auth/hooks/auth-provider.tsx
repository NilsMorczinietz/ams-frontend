import type { KeycloakTokenParsed } from 'keycloak-js';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AuthContext, type AuthContextValue } from './auth-context';
import {
  initializeKeycloak,
  keycloak,
  login as loginWithKeycloak,
  logout as logoutFromKeycloak,
} from '../keycloak-client';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenParsed, setTokenParsed] = useState<KeycloakTokenParsed>();

  const syncAuthState = useCallback(() => {
    setIsAuthenticated(Boolean(keycloak.authenticated));
    setTokenParsed(keycloak.tokenParsed);
  }, []);

  useEffect(() => {
    let isActive = true;

    const handleAuthChange = () => {
      if (!isActive) {
        return;
      }

      syncAuthState();
    };

    void initializeKeycloak()
      .catch((error: unknown) => {
        console.error('Keycloak initialization failed', error);
      })
      .finally(() => {
        handleAuthChange();
        if (isActive) {
          setIsInitialized(true);
        }
      });

    keycloak.onAuthSuccess = handleAuthChange;
    keycloak.onAuthRefreshSuccess = handleAuthChange;
    keycloak.onAuthLogout = handleAuthChange;
    keycloak.onTokenExpired = () => {
      void keycloak
        .updateToken(30)
        .then(handleAuthChange)
        .catch(handleAuthChange);
    };

    return () => {
      isActive = false;

      keycloak.onAuthSuccess = undefined;
      keycloak.onAuthRefreshSuccess = undefined;
      keycloak.onAuthLogout = undefined;
      keycloak.onTokenExpired = undefined;
    };
  }, [syncAuthState]);

  const login = useCallback(async () => {
    await loginWithKeycloak();
  }, []);

  const logout = useCallback(async () => {
    await logoutFromKeycloak();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isInitialized,
      tokenParsed,
      login,
      logout,
    }),
    [isAuthenticated, isInitialized, tokenParsed, login, logout]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
