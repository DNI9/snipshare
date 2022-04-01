import { Collection } from '@prisma/client';
import { Object } from 'ts-toolbelt';

export type CollectionWithCount = Object.Merge<
  Collection,
  { _count: { snippets: number } }
>;
