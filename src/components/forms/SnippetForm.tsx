import { useRef } from 'react';

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
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { Collection } from '@prisma/client';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import { languages } from '~/constants';
import { useToaster } from '~/lib/hooks';
import { SnippetSchema } from '~/schema/snippet';
import { deleteSnippet } from '~/services/client/snippet';

import { CodeHighlighter } from '../core';

type SnippetType = yup.InferType<typeof SnippetSchema>;

type Props = {
  initialValues: SnippetType;
  onSubmit: (
    values: SnippetType,
    actions: FormikHelpers<SnippetType>
  ) => Promise<void>;
  collections?: Pick<Collection, 'id' | 'title'>[];
  isUpdateForm?: boolean;
};

export const SnippetForm = ({
  initialValues,
  onSubmit,
  isUpdateForm = false,
  collections,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const router = useRouter();
  const { showErrorToast, showSuccessToast } = useToaster();

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
            <HStack w="full">
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
              {collections && collections.length ? (
                <FormControl
                  isInvalid={!!errors.collection && touched.collection}
                >
                  <FormLabel htmlFor="collection">Collection</FormLabel>
                  <Field
                    as={Select}
                    id="collection"
                    name="collection"
                    variant="filled"
                    errorBorderColor="red.300"
                    placeholder="Select collection"
                  >
                    {collections.map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.title}
                      </option>
                    ))}
                  </Field>
                  <FormErrorMessage>{errors.language}</FormErrorMessage>
                </FormControl>
              ) : null}
            </HStack>
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
            {isUpdateForm && (
              <>
                <Button
                  colorScheme="red"
                  isFullWidth
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  onClick={onOpen}
                >
                  Delete snippet
                </Button>
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Snippet
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        Are you sure you want to delete this snippet?
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() =>
                            deleteSnippet(
                              String(router.query?.snipId),
                              data => {
                                if (data.deleted) {
                                  showSuccessToast('Snippet deleted');
                                  router.replace('/');
                                } else {
                                  showErrorToast('failed to delete snipper');
                                }
                              }
                            )
                          }
                          ml={3}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </>
            )}
          </VStack>
        </Form>
      )}
    </Formik>
  );
};
