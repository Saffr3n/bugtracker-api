import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DETAIL_MAX_LENGTH,
  TICKET_TYPES
} from '../constants/validation';

export class ApiError extends Error {
  public constructor(reason: any) {
    const message = reason.message || reason;
    super(message);
    this.name = reason.name || this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export abstract class ClientError extends ApiError {
  public abstract readonly status: number;
  public readonly type: string;
  public readonly title: string;
  public readonly detail: string;

  /**
   * @param [removeLastWord=false] - Indicates whether to remove the last word from the generated error title. The
   *                                 error title is generated from the constructor name, which usually ends with the
   *                                 word "Error". Sometimes it makes sense to remove this suffix for clarity. For
   *                                 instance, "InternalServerError" might benefit from keeping the last word
   *                                 (resulting in "Internal Server Error"), whereas "NotFoundError" might be clearer
   *                                 without the "Error" suffix (resulting in "Not Found"). Default: `false`.
   */
  public constructor(reason: any, removeLastWord: boolean = false) {
    super(reason);
    const words = this.name.split(/([A-Z][a-z]+)/).filter(Boolean);
    if (removeLastWord) words.splice(-1);
    this.type = `/errors/${words.join('-').toLowerCase()}`;
    this.title = words.join(' ');
    this.detail = this.message;
  }

  /** @param [includeStack=false] - Default: `false` */
  public toJson(includeStack: boolean = false): FailureResponseJson {
    const { type, status, title, detail, stack } = this;
    const json: FailureResponseJson = { type, status, title, detail };
    if (includeStack) json.stack = stack;
    return json;
  }
}

export class InternalServerError extends ClientError {
  public override readonly status: number = 500;

  public constructor() {
    super('Oops! Something went wrong. Please try again later.');
  }
}

export class PathNotFoundError extends ClientError {
  public override readonly status: number = 404;

  public constructor() {
    super(
      'The requested path could not be found. It either does not exist on the server or is misspelled. Please check the path correctness and try again.',
      true
    );
  }
}

export class AccessDeniedError extends ClientError {
  public override readonly status: number = 403;

  public constructor() {
    super(
      'Not enough privileges to access the requested path. Please contact your supervisor or administrator to elevate your user role.',
      true
    );
  }
}

export class UnauthenticatedError extends ClientError {
  public override readonly status: number = 401;

  public constructor() {
    super(
      'The requested path is only accessible to authenticated users. Please log in to continue.',
      true
    );
  }
}

export class LoginError extends ClientError {
  public override readonly status: number = 401;

  public constructor() {
    super(
      'Invalid username/email or password. Either they are misspelled or the user with the provided credentials does not exist. Please check the correctness of your credentials and try again, or create a new account if it does not exist yet.'
    );
  }
}

export abstract class ValidationError extends ClientError {
  public override readonly status: number = 400;
}

export class UsernameRequiredError extends ValidationError {
  public constructor() {
    super(
      'Username is required. It serves as a unique identifier in the user profile URL, as a display name, and during the login process. Please choose a username that represents you and is not already in use.',
      true
    );
  }
}

export class UsernameLengthError extends ValidationError {
  public constructor() {
    super(
      `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters in length. Please choose a username within this limit.`
    );
  }
}

export class UsernameInvalidError extends ValidationError {
  public constructor() {
    super(
      'Username can only contain letters, numbers, and non-consecutive spaces, underscores, dashes, or dots. Please choose a valid username.',
      true
    );
  }
}

export class UsernameAlreadyInUseError extends ValidationError {
  public constructor() {
    super(
      'The provided username is already in use. Please choose a different username that has not been taken.',
      true
    );
  }
}

export class EmailRequiredError extends ValidationError {
  public constructor() {
    super(
      'Email is required solely for essential account-related communication, such as account recovery or login process. Rest assured, it will not be shared with any third party.',
      true
    );
  }
}

export class EmailInvalidError extends ValidationError {
  public constructor() {
    super(
      'The provided email address is invalid. Please make sure the email address follows the standard email format (e.g., example@example.com).',
      true
    );
  }
}

export class EmailAlreadyInUseError extends ValidationError {
  public constructor() {
    super(
      'The provided email address is already in use. Please use a different email address or try to recover your account if you have forgotten your credentials.',
      true
    );
  }
}

export class PasswordRequiredError extends ValidationError {
  public constructor() {
    super(
      'Password is required for account security. It is essential for performing account-related actions. Please provide a password to continue.',
      true
    );
  }
}

export class PasswordTooShortError extends ValidationError {
  public constructor() {
    super(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters in length. Please choose a longer password for better security.`,
      true
    );
  }
}

export class PasswordInvalidError extends ValidationError {
  public constructor() {
    super(
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit.',
      true
    );
  }
}

export class PasswordConfirmationError extends ValidationError {
  public constructor() {
    super(
      'Password does not match the confirmation field. Please ensure they are identical.'
    );
  }
}

export class TitleRequiredError extends ValidationError {
  public constructor() {
    super(
      'Document title is required. Please choose a descriptive title that represents your document.',
      true
    );
  }
}

export class TitleLengthError extends ValidationError {
  public constructor() {
    super(
      `Document title must be between ${TITLE_MIN_LENGTH} and ${TITLE_MAX_LENGTH} characters in length. Please choose a title within this limit.`
    );
  }
}

export class TitleInvalidError extends ValidationError {
  public constructor() {
    super(
      'Document title can only contain letters, numbers, and non-consecutive spaces, underscores, dashes, or dots. Please choose a valid title.'
    );
  }
}

export class TitleAlreadyInUseError extends ValidationError {
  public constructor() {
    super(
      'The provided document title is already in use. Please choose a different title that has not been taken.',
      true
    );
  }
}

export class DetailRequiredError extends ValidationError {
  public constructor() {
    super(
      'Document detail is required. Please provide a descriptive detail that explains the purpose of this document.',
      true
    );
  }
}

export class DetailTooLongError extends ValidationError {
  public constructor() {
    super(
      `Document detail must be at most ${DETAIL_MAX_LENGTH} characters in length. Please provide a shorter detail.`,
      true
    );
  }
}

export class TicketTypeRequiredError extends ValidationError {
  public constructor() {
    super(
      'Ticket type is required. Please choose a type that represents the purpose of this ticket.',
      true
    );
  }
}

export class TicketTypeInvalidError extends ValidationError {
  public constructor() {
    super(
      `Ticket type can only be one of the following values: ${TICKET_TYPES.join(
        ', '
      )}. Please choose one of the available types.`,
      true
    );
  }
}

export class IDInvalidError extends ValidationError {
  public constructor() {
    super(
      'Document ID is invalid. Please provide a valid ID of the parent document (e.g., if you are trying to create a ticket, provide the ID of the project this ticket is associated with).',
      true
    );
  }
}

export const validationErrors = {
  UsernameRequiredError,
  UsernameLengthError,
  UsernameInvalidError,
  UsernameAlreadyInUseError,
  EmailRequiredError,
  EmailInvalidError,
  EmailAlreadyInUseError,
  PasswordRequiredError,
  PasswordTooShortError,
  PasswordInvalidError,
  PasswordConfirmationError,
  TitleRequiredError,
  TitleLengthError,
  TitleInvalidError,
  TitleAlreadyInUseError,
  DetailRequiredError,
  DetailTooLongError,
  TicketTypeRequiredError,
  TicketTypeInvalidError,
  IDInvalidError
};

export const clientErrors = {
  InternalServerError,
  PathNotFoundError,
  AccessDeniedError,
  UnauthenticatedError,
  LoginError,
  ...validationErrors
};
