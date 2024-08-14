export enum IdentityProvider {
  Credentials = 'credentials',
  Google = 'google',
  MicrosoftEntraId = 'microsoft-entra-id'
}

export enum OAuthIdentityProvider {
  Google = IdentityProvider.Google,
  MicrosoftEntraId = IdentityProvider.MicrosoftEntraId
}

export const identityProviderFriendlyNames = {
  [IdentityProvider.Credentials]: 'Credentials',
  [IdentityProvider.Google]: 'Google',
  [IdentityProvider.MicrosoftEntraId]: 'Microsoft'
} as const;
