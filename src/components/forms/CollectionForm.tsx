import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { FormikHelpers } from 'formik';
import { Field, Form, Formik } from 'formik';

import { CollectionSchema } from '~/schema/collection';
import { CollectionSchemaType } from '~/types/collection';

type Props = {
  initialValues: CollectionSchemaType;
  onSubmit: (
    values: CollectionSchemaType,
    actions: FormikHelpers<CollectionSchemaType>
  ) => Promise<void>;
  isUpdateForm?: boolean;
};

export const CollectionForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  isUpdateForm = false,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CollectionSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting, values }) => (
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

            <Field
              as={Checkbox}
              defaultChecked={values.isPrivate}
              id="isPrivate"
              name="isPrivate"
              colorScheme="blue"
            >
              Make collection {values.isPrivate ? 'public' : 'private'}
            </Field>

            <Button
              type="submit"
              colorScheme="blue"
              isFullWidth
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isUpdateForm ? 'Update' : 'Create'} collection
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};
