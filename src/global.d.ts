type Err = import('./utils/errors').ApiError;
type Req = import('express').Request;
type Res = import('express').Response;
type Next = import('express').NextFunction;

interface ErrorResponse {
  readonly type: string;
  readonly status: number;
  readonly title: string;
  readonly detail: string;
  readonly stack?: string;
}
