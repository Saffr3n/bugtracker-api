export const LIMIT_MIN_VALUE = 1;
export const LIMIT_MAX_VALUE = 100;
export const LIMIT_DEFAULT_VALUE = 20;

export const PAGE_MIN_VALUE = 1;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 24;

export const PASSWORD_MIN_LENGTH = 8;

export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 80;

export const DETAIL_MAX_LENGTH = 1024;

export enum USER_ROLES {
  'User',
  'Developer',
  'Project Manager',
  'Admin'
}

export const TICKET_TYPES = ['Feature', 'Issue', 'Task', 'Help'] as const;
export const TICKET_STATUSES = ['Open', 'Closed'] as const;
export const TICKET_PRIORITIES = ['High', 'Medium', 'Low'] as const;
