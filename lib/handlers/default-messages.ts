export const errorMessages = {
  InvalidInputs: 'Your inputs are incorrect. Please check.',
  InvalidVerificationCode: 'Invalid verification code. Please check',
  InvalidVerificationLink: 'Invalid verification link. Please check',
  ExpiredVerificationCode: 'Verification code is expired. Try resending.',
  ExpiredVerificationLink: 'Verification link is expired. Try resending.',
  EmailIsInUse: 'The email is already in use.',
  LoginFailed: 'Login failed. Please try again.',
  AfterSignupLoginFailed:
    'Your account was created, but login failed. Please try again.',
  EmailNotVerified: 'Your email is not verified. Please check your inbox.',
  ResendVerificationFailed: 'Failed to resend verification email.',
  InvalidCredentials: 'Invalid email or password.',
  UserBlocked: 'Your account is blocked.',
  CredentialsSignin: 'Invalid email or password.',
  AccessDenied: 'You do not have permission to login.',
  AccountNotLinked:
    'This email is linked to a different login method. Use the correct method to login.',
  OAuthAccountNotLinked:
    'This email is linked to a different login method. Use the correct method to login.',
  UnexpectedError: 'An unexpected error occurred. Please try again later.',
  Unauthorized: 'You are not authorized.',
  UserNotFound: 'No user found. Please sign up to continue.',
} as const; // Marking it as `const` to infer literal types

export const successMessages = {
  EmailAlreadyVerified: 'The email is already verified.',
  EmailVerificationSent: 'Sent a verification token. Please check your inbox.',
  EmailVerifiedSuccess: 'Verified your email successfully.',
  SignUpSuccess: 'Your account is created. Please verify your email.',
  LoginSuccess: 'Logged in successfully!',
  LogoutSuccess: 'Logged out successfully!',
  DefaultSuccess: 'Successfully executed the request!',
} as const; // Marking it as `const` to infer literal types
