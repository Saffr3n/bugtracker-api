export abstract class ApiError extends Error implements ErrorResponse {
  public abstract readonly type: string;
  public abstract readonly status: number;
  public readonly title: string;
  public abstract readonly detail?: string;

  constructor(reason: string | Error) {
    const message = reason instanceof Error ? reason.message : reason;
    super(message);
    this.name = this.constructor.name;
    this.title = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalServerError extends ApiError {
  public override readonly type: string = '/errors/internal.html';
  public override readonly status: number = 500;
  public override readonly detail: string =
    'Some internal server error occurred. Please try again later.';

  constructor() {
    super('Internal Server Error');
  }
}

export class MongoError extends ApiError {
  public override readonly type: string = 'about:blank';
  public override readonly status: number = 500;
  public override readonly detail?: string;

  constructor(reason: string | Error) {
    super(reason);
  }
}

export class BcryptError extends ApiError {
  public override readonly type: string = 'about:blank';
  public override readonly status: number = 500;
  public override readonly detail?: string;

  constructor(reason: string | Error) {
    super(reason);
  }
}

export class PathNotFoundError extends ApiError {
  public override readonly type: string = '/errors/path-not-found.html';
  public override readonly status: number = 404;
  public override readonly detail: string =
    'The requested path could not be found. It either does not exist on the server or is misspelled.';

  constructor() {
    super('Path Not Found');
  }
}
