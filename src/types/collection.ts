import { Collection } from '@prisma/client';
import { Object } from 'ts-toolbelt';
import * as yup from 'yup';

import { CollectionSchema } from '~/schema/collection';

export type CollectionWithCount = Object.Merge<
  Collection,
  { _count: { snippets: number } }
>;

export type CollectionSchemaType = yup.InferType<typeof CollectionSchema>;
