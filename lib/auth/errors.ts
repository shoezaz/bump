export enum AuthErrorCode {
  NewEmailConflict = 'new_email_conflict',
  UnverifiedEmail = 'unverified_email',
  IncorrectEmailOrPassword = 'incorrect_email_or_password',
  RateLimitExceeded = 'rate_limit_exceeded',
  IllegalOAuthProvider = 'illegal_oauth_provider',
  InternalServerError = 'internal_server_error',
  UnknownError = 'unknown_error'
}

export const authErrorMessages: Record<AuthErrorCode, string> = {
  [AuthErrorCode.NewEmailConflict]: 'Email already exists.',
  [AuthErrorCode.UnverifiedEmail]: 'Email is not verified.',
  [AuthErrorCode.IncorrectEmailOrPassword]: 'Email or password is not correct.',
  [AuthErrorCode.RateLimitExceeded]: 'Rate limit exceeded.',
  [AuthErrorCode.IllegalOAuthProvider]: 'Illegal OAuth provider.',
  [AuthErrorCode.InternalServerError]:
    'Something went wrong. Please try again later.',
  [AuthErrorCode.UnknownError]: 'Unknown error.'
};
