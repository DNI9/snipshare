import { User } from '@prisma/client';

export type UserWithCounts = User & {
  _count: { snippets: number; collections: number };
};
