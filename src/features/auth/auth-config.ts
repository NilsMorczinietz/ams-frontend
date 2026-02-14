import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    // TODO: Put in .env file
    clientId: '2f05f649-cab3-419c-86b8-1f617d503cf0',
    authority:
      'https://login.microsoftonline.com/c38a7252-6cb6-41fb-839b-a7a89aeb0af9/',
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;

          case LogLevel.Info:
            // console.info(message);
            return;

          case LogLevel.Verbose:
            console.debug(message);
            return;

          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
};
