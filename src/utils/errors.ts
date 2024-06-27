import {
  LIMIT_MIN_VALUE,
  LIMIT_MAX_VALUE,
  PAGE_MIN_VALUE,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DETAIL_MAX_LENGTH,
  TICKET_TYPES,
  TICKET_PRIORITIES
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

export class UserNotFoundError extends ClientError {
  public override readonly status: number = 404;

  public constructor() {
    super(
      'The user with provided ID could not be found. They either do not exist or their ID is misspelled. Please check the user ID correctness and try again.'
    );
  }
}

export class ProjectNotFoundError extends ClientError {
  public override readonly status: number = 404;

  public constructor() {
    super(
      'The project with provided ID could not be found. It either does not exist or its ID is misspelled. Please check the project ID correctness and try again.',
      true
    );
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

export class AuthenticationError extends ClientError {
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

export class LimitInvalidError extends ValidationError {
  public constructor() {
    super(
      'The provided "limit" URL parameter is invalid. It must be an integer. Please provide a limit that meets this requirement.',
      true
    );
  }
}

export class LimitTooLowError extends ValidationError {
  public constructor() {
    super(
      `The provided "limit" URL parameter is invalid. It must be an integer starting from ${LIMIT_MIN_VALUE}. Please provide a limit that meets this requirement.`,
      true
    );
  }
}

export class LimitTooHighError extends ValidationError {
  public constructor() {
    super(
      `The provided "limit" URL parameter is invalid. It must be an integer up to ${LIMIT_MAX_VALUE}. Please provide a limit that meets this requirement.`,
      true
    );
  }
}

export class PageInvalidError extends ValidationError {
  public constructor() {
    super(
      'The provided "page" URL parameter is invalid. It must be an integer. Please provide a page number that meets this requirement.',
      true
    );
  }
}

export class PageTooLowError extends ValidationError {
  public constructor() {
    super(
      `The provided "page" URL parameter is invalid. It must be an integer starting from ${PAGE_MIN_VALUE}. Please provide a page number that meets this requirement.`,
      true
    );
  }
}

export class SortInvalidError extends ValidationError {
  public constructor() {
    super(
      'The provided "sort" URL parameter is invalid. It must contain only valid keys for the requested document. Please check the correctness of the keys and try again.',
      true
    );
  }
}

export class UsernameRequiredError extends ValidationError {
  public constructor() {
    super(
      'Username is required. It serves as a unique display name and can be used during the login process instead of an email. Please choose a username that represents you.',
      true
    );
  }
}

export class UsernameTooShortError extends ValidationError {
  public constructor() {
    super(
      `The provided username is too short. It must be at least ${USERNAME_MIN_LENGTH} characters long. Please choose a longer username.`,
      true
    );
  }
}

export class UsernameTooLongError extends ValidationError {
  public constructor() {
    super(
      `The provided username is too long. It must be at most ${USERNAME_MAX_LENGTH} characters long. Please choose a shorter username.`,
      true
    );
  }
}

export class UsernameStartError extends ValidationError {
  public constructor() {
    super(
      'The provided username is invalid. It must start with a Latin letter. Please choose a username that meets this requirement.'
    );
  }
}

export class UsernameInvalidCharactersError extends ValidationError {
  public constructor() {
    super(
      'The provided username is invalid. It can only contain Latin letters, numbers, dots, underscores, and hyphens. Please choose a username that meets this requirement.'
    );
  }
}

export class UsernameConsecutiveCharactersError extends ValidationError {
  public constructor() {
    super(
      'The provided username is invalid. It cannot contain consecutive dots, underscores, or hyphens. Please choose a username that meets this requirement.'
    );
  }
}

export class UsernameEndError extends ValidationError {
  public constructor() {
    super(
      'The provided username is invalid. It must end with a Latin letter or number. Please choose a username that meets this requirement.'
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
      'Email is required. It is used solely for essential account-related communication such as account recovery or authentication. Please provide an email to continue.',
      true
    );
  }
}

export class EmailInvalidError extends ValidationError {
  public constructor() {
    super(
      'The provided email is invalid. Please make sure the email address follows the standard email format (e.g., example@example.com).',
      true
    );
  }
}

export class EmailAlreadyInUseError extends ValidationError {
  public constructor() {
    super(
      'The provided email is already in use. Please use a different email address or try to recover your account if you have forgotten your credentials.',
      true
    );
  }
}

export class PasswordRequiredError extends ValidationError {
  public constructor() {
    super(
      'Password is required. It is essential for performing account-related actions. Please provide a password to continue.',
      true
    );
  }
}

export class PasswordTooShortError extends ValidationError {
  public constructor() {
    super(
      `The provided password is too short. It must be at least ${PASSWORD_MIN_LENGTH} characters long. Please choose a longer password for better security.`,
      true
    );
  }
}

export class PasswordInvalidError extends ValidationError {
  public constructor() {
    super(
      'The provided password is invalid. It must contain at least one uppercase letter, one lowercase letter, and one digit. Please choose a password that meets this requirement.',
      true
    );
  }
}

export class PasswordConfirmationError extends ValidationError {
  public constructor() {
    super(
      'The provided password does not match the confirmation field. Please ensure they are identical.'
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

export class TitleTooShortError extends ValidationError {
  public constructor() {
    super(
      `The provided document title is too short. It must be at least ${TITLE_MIN_LENGTH} characters long. Please choose a longer title.`,
      true
    );
  }
}

export class TitleTooLongError extends ValidationError {
  public constructor() {
    super(
      `The provided document title is too long. It must be at most ${TITLE_MAX_LENGTH} characters long. Please choose a shorter title.`,
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
      `The provided document detail is too long. It must be at most ${DETAIL_MAX_LENGTH} characters long. Please provide a shorter detail.`,
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
      `The provided ticket type is invalid. It can only be one of the following values: ${TICKET_TYPES.join(
        ', '
      )}. Please choose one of the available types.`,
      true
    );
  }
}

export class TicketPriorityRequiredError extends ValidationError {
  public constructor() {
    super(
      'Ticket priority is required. Please choose a priority level for this ticket.',
      true
    );
  }
}

export class TicketPriorityInvalidError extends ValidationError {
  public constructor() {
    super(
      `The provided ticket priority is invalid. It can only be one of the following values: ${TICKET_PRIORITIES.join(
        ', '
      )}. Please choose one of the available priority levels.`,
      true
    );
  }
}

export class UserIDInvalidError extends ValidationError {
  public constructor() {
    super(
      'The provided user ID is invalid. Please check the user ID correctness and try again.',
      true
    );
  }
}

export class ProjectIDInvalidError extends ValidationError {
  public constructor() {
    super(
      'The provided project ID is invalid. Please check the project ID correctness and try again.',
      true
    );
  }
}

export const clientErrors = {
  InternalServerError,

  UserNotFoundError,
  ProjectNotFoundError,

  PathNotFoundError,
  AccessDeniedError,
  UnauthenticatedError,
  AuthenticationError,

  LimitInvalidError,
  LimitTooLowError,
  LimitTooHighError,

  PageInvalidError,
  PageTooLowError,

  SortInvalidError,

  UsernameRequiredError,
  UsernameTooShortError,
  UsernameTooLongError,
  UsernameStartError,
  UsernameInvalidCharactersError,
  UsernameConsecutiveCharactersError,
  UsernameEndError,
  UsernameAlreadyInUseError,

  EmailRequiredError,
  EmailInvalidError,
  EmailAlreadyInUseError,

  PasswordRequiredError,
  PasswordTooShortError,
  PasswordInvalidError,
  PasswordConfirmationError,

  TitleRequiredError,
  TitleTooShortError,
  TitleTooLongError,

  DetailRequiredError,
  DetailTooLongError,

  TicketTypeRequiredError,
  TicketTypeInvalidError,

  TicketPriorityRequiredError,
  TicketPriorityInvalidError,

  UserIDInvalidError,
  ProjectIDInvalidError
};
