import { DB_PAGE_LIMIT } from '~/constants';

export const getSkip = (page: number) => (page - 1) * DB_PAGE_LIMIT;

export const getTotalPages = (count: number) =>
  Math.ceil(count / DB_PAGE_LIMIT);
