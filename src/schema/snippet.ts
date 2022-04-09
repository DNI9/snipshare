import * as yup from 'yup';

export const SnippetSchema = yup
  .object({
    title: yup.string().required().min(2).max(100),
    content: yup.string().max(5000).required('Snippet code is required'),
    language: yup.string().required(),
    description: yup.string().max(500),
    collection: yup.string(),
    isPrivate: yup.boolean(),
  })
  .strict();
