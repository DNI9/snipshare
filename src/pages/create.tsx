import { Container } from '@chakra-ui/react';
import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import { SnippetForm } from '~/components/forms';
import { SITE_URL } from '~/constants';
import { Meta, AppLayout } from '~/layout';
import { useToaster } from '~/lib/hooks';
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
  const { showErrorToast, showSuccessToast } = useToaster();

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
      const res = await fetch(`${SITE_URL}/api/snippet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.ok) showSuccessToast('Snippet created.');
      else throw new Error(res.statusText || 'Something went wrong');
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to create snippet');
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
