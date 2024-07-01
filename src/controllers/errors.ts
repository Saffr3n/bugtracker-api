import { clientErrors } from '../utils/errors';
import { stringToCaseInsensitiveRegex } from '../utils';
import type { Request, Response, NextFunction } from 'express';

type ClientErrorName = keyof typeof clientErrors;

export const getError = (req: Request, res: Response, next: NextFunction) => {
  const errNames = Object.keys(clientErrors) as ClientErrorName[];
  const errName = req.params.errorName.replaceAll('-', '');
  const regex = stringToCaseInsensitiveRegex(errName, false);
  const match = errNames.find((name) => regex.test(name));
  if (!match) return next();
  const err = new clientErrors[match]();
  const { title, status, detail } = err;
  res.status(200).send(createErrorHtml(title, status, detail));
};

const createErrorHtml = (
  title: string,
  status: number,
  detail: string
) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body>
    <h1>${title}</h1>
    <h2>${status}</h2>
    <p>${detail}</p>
  </body>
</html>`;
