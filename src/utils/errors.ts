export abstract class ApiError extends Error implements ErrorResponse {
  public abstract readonly type: string;
  public abstract readonly status: number;
  public readonly title: string;
  public abstract readonly detail: string;

  constructor(title: string) {
    super(title);
    this.name = this.constructor.name;
    this.title = title;
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

export class PathNotFoundError extends ApiError {
  public override readonly type: string = '/errors/path-not-found.html';
  public override readonly status: number = 404;
  public override readonly detail: string =
    'The requested path could not be found. It either does not exist on the server or is misspelled.';

  constructor() {
    super('Path Not Found');
  }
}
