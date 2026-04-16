import { useAuth } from '@features/auth/hooks/auth-context';
import type { User } from '../types/user';
import type { KeycloakIdTokenClaims } from '../types/auth';

export function useCurrentUser(): User | null {
  const { tokenParsed, isAuthenticated } = useAuth();

  if (!isAuthenticated || !tokenParsed) {
    return null;
  }

  const claims = tokenParsed as KeycloakIdTokenClaims;
  if (!claims.sub) {
    return null;
  }

  return {
    id: claims.sub,
    name: claims.name ?? claims.preferred_username ?? 'Unknown User',
    email: claims.email ?? '',
  };
}
