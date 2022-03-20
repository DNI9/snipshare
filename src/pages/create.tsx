import { Container, useToast } from '@chakra-ui/react';
import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import { SnippetForm } from '~/components/forms';
import { Meta, AppLayout } from '~/layout';
import { SnippetSchema } from '~/schema/snippet';

type SnippetType = yup.InferType<typeof SnippetSchema>;

const defaultCode = `
import React from 'react'

export const MyCode = () => {
  return (
    <div>MyCode</div>
  )
}
`.trim();

export default function CreateSnippet() {
  const toast = useToast();

  const initialValues: SnippetType = {
    title: '',
    description: '',
    content: defaultCode,
    isPrivate: false,
    language: 'jsx',
  };

  async function postSnippet(
    values: SnippetType,
    actions: FormikHelpers<SnippetType>
  ) {
    try {
      const res = await fetch(`http://localhost:3000/api/snippet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        toast({
          title: 'Snippet created.',
          status: 'success',
          isClosable: true,
          position: 'top-right',
        });
      } else {
        throw new Error(res.statusText || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to create snippet',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      actions.setSubmitting(false);
    }
  }

  return (
    <>
      <Meta title="Create new snippet" />
      <AppLayout>
        <Container my={5} maxW="container.md">
          <SnippetForm initialValues={initialValues} onSubmit={postSnippet} />
        </Container>
      </AppLayout>
    </>
  );
}
