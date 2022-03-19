import { CSSProperties } from 'react';

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
import { Formik, Field, Form } from 'formik';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsLight';
import Editor from 'react-simple-code-editor';
import * as yup from 'yup';

import { languages } from '~/constants';
import { Meta, AppLayout } from '~/layout';
import { SnippetSchema } from '~/schema/snippet';

type SnippetType = yup.InferType<typeof SnippetSchema>;

const exampleCode = `
{/* EDIT FROM HERE */}
import React from 'react'

export const MyCode = () => {
  return (
    <div>MyCode</div>
  )
}
`.trim();

const styles: CSSProperties = {
  boxSizing: 'border-box',
  fontFamily: '"Dank Mono", "Fira Code", monospace',
  border: '1px solid gray',
  borderRadius: '5px',
  ...theme.plain,
};

export default function CreateSnippet() {
  const initialValues: SnippetType = {
    title: '',
    description: '',
    content: exampleCode,
    isPrivate: true,
    language: 'jsx',
  };

  return (
    <>
      <Meta title="Create new snippet" />
      <AppLayout>
        <Formik
          initialValues={initialValues}
          validationSchema={SnippetSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              console.log(values);
              actions.setSubmitting(false);
            }, 500);
          }}
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
                  <Editor
                    tabSize={2}
                    insertSpaces
                    value={values.content}
                    onChange={handleChange}
                    onValueChange={handleChange}
                    onBlur={handleBlur}
                    id="content"
                    name="content"
                    padding={5}
                    style={styles}
                    highlight={code => (
                      <Highlight
                        {...defaultProps}
                        code={code}
                        language={values.language as Language}
                        theme={theme}
                      >
                        {({ tokens, getLineProps, getTokenProps }) => (
                          <>
                            {tokens.map((line, i) => (
                              <div {...getLineProps({ line, key: i })} key={i}>
                                {line.map((token, key) => (
                                  <span
                                    key={key}
                                    {...getTokenProps({ token, key })}
                                  />
                                ))}
                              </div>
                            ))}
                          </>
                        )}
                      </Highlight>
                    )}
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
                  Create snippet
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </AppLayout>
    </>
  );
}
