import * as yup from 'yup';

export const SnippetSchema = yup
  .object({
    title: yup.string().required().min(2).max(100),
    content: yup.string().required('Snippet code is required'),
    language: yup.string().required(),
    description: yup.string().max(500),
    isPrivate: yup.boolean(),
  })
  .strict();
