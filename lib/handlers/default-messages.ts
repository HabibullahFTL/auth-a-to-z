export const errorMessages = {
  // Common
  InvalidInputs: 'Your inputs are incorrect. Please check.',
  UnexpectedError: 'An unexpected error occurred. Please try again later.',
  Unauthorized: 'You are not authorized.',

  // Sign up
  EmailIsInUse: 'The email is already in use.',

  // Login
  AfterSignupLoginFailed:
    'Your account was created, but login failed. Please try login.',
  UserNotFound: 'No user found. Please sign up to continue.',
  LoginFailed: 'Login failed. Please try again.',
  InvalidCredentials: 'Invalid email or password.',
  UserBlocked: 'Your account is blocked.',
  CredentialsSignin: 'Invalid email or password.',
  AccessDenied: 'You do not have permission to login.',
  AccountNotLinked:
    'This email is linked to a different login method. Use the correct method to login.',
  OAuthAccountNotLinked:
    'This email is linked to a different login method. Use the correct method to login.',

  // Email Verification
  InvalidVerificationCode: 'Invalid verification code. Please check',
  InvalidVerificationLink: 'Invalid verification link. Please check',
  ExpiredVerificationCode: 'Verification code is expired. Try resending.',
  ExpiredVerificationLink: 'Verification link is expired. Try resending.',
  ResendVerificationFailed: 'Failed to resend verification email.',
  EmailNotVerified: 'Your email is not verified. Please check your inbox.',

  // 2FA
  Invalid2FACode: 'Invalid 2FA code. Please check.',
  TwoFactorConfirmationMissing: 'Missing 2FA confirmation. Try login properly.',
  Failed2FATokenGeneration: 'Failed to generate 2FA token. Try again.',
  '2FATokenSendingFailed': 'Failed to send 2FA code. Try again',
  Expired2FACode: 'Expired 2FA code. Please try again login.',

  // Reset Password
  InvalidResetPasswordLink: 'Invalid reset password link.',
  ExpiredResetPasswordLink:
    'The reset password link has expired. Please request a new one.',
  ResetPasswordRequestFailed: 'Failed to send reset request.',
} as const; // Marking it as `const` to infer literal types

export const successMessages = {
  // Common
  DefaultSuccess: 'Successfully executed the request!',

  // Sign up
  SignUpSuccess: 'Your account is created. Please verify your email.',

  // Login
  LoginSuccess: 'Logged in successfully!',
  LogoutSuccess: 'Logged out successfully!',

  // Email Verification
  EmailAlreadyVerified: 'The email is already verified.',
  EmailVerificationSent: 'Sent a verification token. Please check your inbox.',
  EmailVerifiedSuccess: 'Verified your email successfully.',

  // Reset password
  ResetPasswordRequestSent:
    'Sent a reset password token. Please check your inbox.',
  ResetPasswordSuccess: 'Your password has been reset successfully.',
  ValidResetPasswordLink: 'This is a valid reset password link',

  // 2FA
  '2FATokenSent': 'Successfully sent the 2FA code.',
} as const; // Marking it as `const` to infer literal types
