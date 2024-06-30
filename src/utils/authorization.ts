import type { AuthorizationCallback } from '../middlewares/authorization';

export const noRoleEdit: AuthorizationCallback = (user, req) => {
  return req.body.role === undefined || user.role === 'Admin';
};
