import { Container } from '@chakra-ui/react';
import { Collection } from '@prisma/client';
import { FormikHelpers } from 'formik';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import * as yup from 'yup';

import { SnippetForm } from '~/components/forms';
import { SITE_URL } from '~/constants';
import { Meta, AppLayout } from '~/layout';
import { useToaster } from '~/lib/hooks';
import { prisma } from '~/lib/prisma';
import { SnippetSchema } from '~/schema/snippet';
import { parseServerData, redirect } from '~/utils/next';

type SnippetType = yup.InferType<typeof SnippetSchema>;

const defaultCode = `
import React from 'react'

export const MyCode = () => {
  return (
    <div>MyCode</div>
  )
}
`.trim();

type Props = {
  collections: Pick<Collection, 'id' | 'title'>[];
};

export default function CreateSnippet({ collections }: Props) {
  const { showErrorToast, showSuccessToast } = useToaster();

  const initialValues: SnippetType = {
    title: '',
    description: '',
    content: defaultCode,
    isPrivate: false,
    collection: '',
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
          <SnippetForm
            initialValues={initialValues}
            onSubmit={postSnippet}
            collections={collections}
          />
        </Container>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) return redirect('/auth/signin');

  const userId = session?.user.id;
  const collections = await prisma.collection.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: 'desc' },
  });

  return {
    props: {
      collections: parseServerData(collections),
    },
  };
};
