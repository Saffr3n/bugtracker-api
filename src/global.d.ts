type Err = import('./utils/errors').ApiError;
type Req = import('express').Request & { err?: Err };
type Res = import('express').Response;
type Next = import('express').NextFunction;

interface ErrorResponse {
  readonly type: string;
  readonly status: number;
  readonly title: string;
  readonly detail?: string;
  readonly stack?: string;
}

interface DataResponse {
  readonly status: number;
  readonly title: string;
  readonly detail?: string;
  readonly [data: string]: any;
}

namespace Express {
  type User = import('mongoose').HydratedDocumentFromSchema<
    typeof import('./models/user').default['schema']
  >;
}
