/**
 * Azure AD ID Token Claims
 * @see https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference
 */
export interface MsalIdTokenClaims {
  /** Object ID - unique identifier for the user */
  oid: string;
  /** Display name of the user */
  name?: string;
  /** Email address (if available) */
  email?: string;
  /** UPN or email used for sign-in */
  preferred_username?: string;
  /** Audience - identifies the intended recipient of the token */
  aud?: string;
  /** Issuer - identifies the STS that constructed and returned the token */
  iss?: string;
  /** Issued at time */
  iat?: number;
  /** Expiration time */
  exp?: number;
  /** Subject - the principal about which the token asserts information */
  sub?: string;
}
