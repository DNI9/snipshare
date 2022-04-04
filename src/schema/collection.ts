import * as yup from 'yup';

export const CollectionSchema = yup
  .object({
    title: yup.string().required().min(2).max(100),
    description: yup.string().max(500).default(''),
    isPrivate: yup.boolean().default(false),
  })
  .strict();
