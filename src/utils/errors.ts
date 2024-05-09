import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH
} from './constants';

export abstract class ApiError extends Error implements ErrorResponse {
  public abstract readonly type: string;
  public abstract readonly status: number;
  public readonly title: string;
  public abstract readonly detail?: string;

  public constructor(reason: string | Error) {
    const message = reason instanceof Error ? reason.message : reason;
    super(message);
    this.title = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default class SystemError extends ApiError {
  public override readonly type: string = 'about:blank';
  public override readonly status: number = 500;
  public override readonly detail?: string;
}

export class InternalServerError extends ApiError {
  public override readonly type: string = '/errors/internal';
  public override readonly status: number = 500;
  public override readonly detail: string =
    'Oops! Something went wrong. Please try again later.';

  public constructor() {
    super('Internal Server Error');
  }
}

export class PathNotFoundError extends ApiError {
  public override readonly type: string = '/errors/path-not-found';
  public override readonly status: number = 404;
  public override readonly detail: string =
    'The requested path could not be found. It either does not exist on the server or is misspelled. Please check the path correctness and try again.';

  public constructor() {
    super('Path Not Found');
  }
}

export class LoginError extends ApiError {
  public override readonly type: string = '/errors/login';
  public override readonly status: number = 401;
  public override readonly detail: string =
    'Invalid username/email or password. Either they are misspelled or user with provided credentials does not exist. Please check correctness of your credentials and try again, or create a new account if it does not exist yet.';

  public constructor() {
    super('Login Error');
  }
}

export class UnauthenticatedError extends ApiError {
  public override readonly type: string = '/errors/unauthenticated';
  public override readonly status: number = 401;
  public override readonly detail: string =
    'The requested path is only accessible to authenticated users. Please log in to continue.';

  public constructor() {
    super('Unauthenticated');
  }
}

export abstract class ValidationError extends ApiError {
  public override readonly status: number = 400;

  public constructor(reason: string | Error) {
    super(reason);
    this.name = 'ValidationError';
  }
}

export class UsernameRequiredError extends ValidationError {
  public override readonly type: string = '/errors/username-required';
  public override readonly detail: string =
    'Username is required. It serves as a unique identifier in user profile URL, as a display name, and during login process. Please choose a username that represents you and is not already in use.';

  public constructor() {
    super('Username Required');
  }
}

export class UsernameLengthError extends ValidationError {
  public override readonly type: string = '/errors/username-length';
  public override readonly detail: string = `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters in length. Please choose a username within this limit.`;

  public constructor() {
    super('Username Length Error');
  }
}

export class UsernameInvalidError extends ValidationError {
  public override readonly type: string = '/errors/username-invalid';
  public override readonly detail: string =
    'Username must start with a letter and can contain only letters, numbers, and non-consecutive underscores, dashes, or dots.';

  public constructor() {
    super('Username Invalid');
  }
}

export class UsernameInUseError extends ValidationError {
  public override readonly type: string = '/errors/username-in-use';
  public override readonly detail: string =
    'The provided username is already in use. Please choose a different username that has not been taken.';

  public constructor() {
    super('Username Already In Use');
  }
}

export class EmailRequiredError extends ValidationError {
  public override readonly type: string = '/errors/email-required';
  public override readonly detail: string =
    'Email is required solely for essential account-related communication, such as account recovery or the login process. Rest assured, it will not be shared with any third party.';

  public constructor() {
    super('Email Required');
  }
}

export class EmailInvalidError extends ValidationError {
  public override readonly type: string = '/errors/email-invalid';
  public override readonly detail: string =
    'The provided email address is invalid. Please make sure the email address follows the standard email format (e.g., example@example.com).';

  public constructor() {
    super('Email Invalid');
  }
}

export class EmailInUseError extends ValidationError {
  public override readonly type: string = '/errors/email-in-use';
  public override readonly detail: string =
    'The provided email address is already in use. Please use a different email address or try to recover your account if you have forgotten your credentials.';

  public constructor() {
    super('Email Already In Use');
  }
}

export class PasswordRequiredError extends ValidationError {
  public override readonly type: string = '/errors/password-required';
  public override readonly detail: string =
    'Password is required for account security. It is essential for preforming account-related actions. Please provide a password to continue.';

  public constructor() {
    super('Password Required');
  }
}

export class PasswordTooShortError extends ValidationError {
  public override readonly type: string = '/errors/password-too-short';
  public override readonly detail: string = `Password must be at least ${PASSWORD_MIN_LENGTH} characters in length. Please choose a longer password for better security.`;

  public constructor() {
    super('Password Too Short');
  }
}

export class PasswordInvalidError extends ValidationError {
  public override readonly type: string = '/errors/password-invalid';
  public override readonly detail: string =
    'Password must contain at least one uppercase letter, one lowercase letter, and one digit.';

  public constructor() {
    super('Password Invalid');
  }
}

export class PasswordConfirmationError extends ValidationError {
  public override readonly type: string = '/errors/password-confirmation';
  public override readonly detail: string =
    'Password does not match the confirmation field. Please ensure they are identical.';

  public constructor() {
    super('Password Confirmation Error');
  }
}

export const validationErrors = {
  UsernameRequired: UsernameRequiredError,
  UsernameLength: UsernameLengthError,
  UsernameInvalid: UsernameInvalidError,
  UsernameInUse: UsernameInUseError,
  EmailRequired: EmailRequiredError,
  EmailInvalid: EmailInvalidError,
  EmailInUse: EmailInUseError,
  PasswordRequired: PasswordRequiredError,
  PasswordTooShort: PasswordTooShortError,
  PasswordInvalid: PasswordInvalidError,
  PasswordConfirmation: PasswordConfirmationError
};

export const clientErrors = {
  Internal: InternalServerError,
  PathNotFound: PathNotFoundError,
  Login: LoginError,
  Unauthenticated: UnauthenticatedError,
  ...validationErrors
};
