import Keycloak, { type KeycloakTokenParsed } from 'keycloak-js';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { keycloakConfig, keycloakInitOptions } from '../auth-config';
import { AuthContext, type AuthContextValue } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

const keycloak = new Keycloak(keycloakConfig);
let keycloakInitPromise: Promise<boolean> | null = null;
const appRedirectUri = window.location.origin;

function initializeKeycloak(): Promise<boolean> {
  if (!keycloakInitPromise) {
    keycloakInitPromise = keycloak.init({
      ...keycloakInitOptions,
      redirectUri: appRedirectUri,
    });
  }

  return keycloakInitPromise;
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
    let isMounted = true;

    void initializeKeycloak()
      .then(() => {
        if (!isMounted) {
          return;
        }

        syncAuthState();
      })
      .catch((error: unknown) => {
        console.error('Keycloak initialization failed', error);
      })
      .finally(() => {
        if (isMounted) {
          setIsInitialized(true);
        }
      });

    keycloak.onAuthSuccess = () => {
      syncAuthState();
    };

    keycloak.onAuthRefreshSuccess = () => {
      syncAuthState();
    };

    keycloak.onAuthLogout = () => {
      setIsAuthenticated(false);
      setTokenParsed(undefined);
    };

    keycloak.onTokenExpired = () => {
      void keycloak.updateToken(30).catch(() => {
        setIsAuthenticated(false);
        setTokenParsed(undefined);
      });
    };

    return () => {
      isMounted = false;

      keycloak.onAuthSuccess = undefined;
      keycloak.onAuthRefreshSuccess = undefined;
      keycloak.onAuthLogout = undefined;
      keycloak.onTokenExpired = undefined;
    };
  }, [syncAuthState]);

  const login = useCallback(async () => {
    await keycloak.login({ redirectUri: appRedirectUri });
  }, []);

  const logout = useCallback(async () => {
    await keycloak.logout({ redirectUri: appRedirectUri });
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
