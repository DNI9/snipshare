import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Select,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';

import { languages } from '~/constants';
import { SnippetSchema } from '~/schema/snippet';

import { CodeHighlighter } from '../core';

type SnippetType = yup.InferType<typeof SnippetSchema>;

type Props = {
  initialValues: SnippetType;
  onSubmit: (
    values: SnippetType,
    actions: FormikHelpers<SnippetType>
  ) => Promise<void>;
  isUpdateForm?: boolean;
};

export const SnippetForm = ({
  initialValues,
  onSubmit,
  isUpdateForm = false,
}: Props) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SnippetSchema}
      onSubmit={onSubmit}
    >
      {({
        errors,
        touched,
        isSubmitting,
        values,
        handleChange,
        handleBlur,
      }) => (
        <Form>
          <VStack spacing={4} align="flex-start">
            <FormControl isInvalid={!!errors.title && touched.title}>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Field
                as={Input}
                errorBorderColor="red.300"
                id="title"
                name="title"
                type="text"
                variant="filled"
                placeholder="e.g. my javascript snippet"
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors.description && touched.description}
            >
              <FormLabel htmlFor="description">
                Description{' '}
                <Text as="span" fontSize="sm" color="gray">
                  (optional)
                </Text>
              </FormLabel>
              <Field
                as={Input}
                id="description"
                name="description"
                type="text"
                variant="filled"
                errorBorderColor="red.300"
                placeholder="A short note describing what this snippet is about"
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.language && touched.language}>
              <FormLabel htmlFor="language">Language</FormLabel>
              <Field
                as={Select}
                id="language"
                name="language"
                variant="filled"
                errorBorderColor="red.300"
                placeholder="Select language"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </Field>
              <FormErrorMessage>{errors.language}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.content && touched.content}>
              <FormLabel htmlFor="content">Snippet</FormLabel>
              <CodeHighlighter
                snippet={{ content: values.content, language: values.language }}
                editorProps={{
                  readOnly: false,
                  onChange: handleChange,
                  onBlur: handleBlur,
                  id: 'content',
                  name: 'content',
                }}
              />
              <FormErrorMessage>{errors.content}</FormErrorMessage>
            </FormControl>
            <Field
              as={Checkbox}
              defaultChecked={values.isPrivate}
              id="isPrivate"
              name="isPrivate"
              colorScheme="blue"
            >
              Make snippet {values.isPrivate ? 'public' : 'private'}
            </Field>
            <Button
              type="submit"
              colorScheme="blue"
              isFullWidth
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isUpdateForm ? 'Update' : 'Create'} snippet
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};
