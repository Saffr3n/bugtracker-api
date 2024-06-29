import { clientErrors } from '../utils/errors';
import { stringToCaseInsensitiveRegex } from '../utils';
import type { Request, Response, NextFunction } from 'express';

type ClientErrorName = keyof typeof clientErrors;

export const getError = (req: Request, res: Response, next: NextFunction) => {
  const errNames = Object.keys(clientErrors) as ClientErrorName[];
  const errName = req.params.errorName!.replaceAll('-', '');
  const regex = stringToCaseInsensitiveRegex(errName, false);
  const match = errNames.find((name) => regex.test(name));
  if (!match) return next();
  const err = new clientErrors[match]();
  const { title, status, detail } = err;
  const html = `<h1>${title}</h1>\n<h2>${status}</h2>\n<p>${detail}</p>`;
  res.status(200).send(html);
};
