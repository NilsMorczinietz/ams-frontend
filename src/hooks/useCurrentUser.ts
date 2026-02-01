import { useMsal } from '@azure/msal-react';
import type { User } from '../types/user';
import type { MsalIdTokenClaims } from '../types/auth';

/**
 * Hook to get the current authenticated user from MSAL
 * @returns User object or null if not authenticated
 */
export function useCurrentUser(): User | null {
  const { accounts } = useMsal();
  const account = accounts[0];

  if (!account?.idTokenClaims) {
    return null;
  }

  const claims = account.idTokenClaims as MsalIdTokenClaims;

  // Validate required fields
  if (!claims.oid) {
    console.warn('Missing oid claim in token');
    return null;
  }

  return {
    id: claims.oid,
    name: claims.name || 'Unknown User',
    email: claims.email || claims.preferred_username || '',
  };
}
