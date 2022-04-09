import { Container } from '@chakra-ui/react';
import { Collection, Snippet } from '@prisma/client';
import { FormikHelpers } from 'formik';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Object } from 'ts-toolbelt';
import * as yup from 'yup';

import { SnippetForm } from '~/components/forms';
import { SITE_URL } from '~/constants';
import { Meta, AppLayout } from '~/layout';
import { useToaster } from '~/lib/hooks';
import { prisma } from '~/lib/prisma';
import { SnippetSchema } from '~/schema/snippet';
import { redirect } from '~/utils/next';

type SnippetType = yup.InferType<typeof SnippetSchema>;

type TSnippet = Pick<
  Snippet,
  'id' | 'title' | 'description' | 'content' | 'isPrivate' | 'language'
>;

type Props = {
  snippet: Object.Merge<TSnippet, { collection: { id: string } }>;
  collections: Pick<Collection, 'id' | 'title'>[];
};

export default function UpdateSnippet({ snippet, collections }: Props) {
  const { showErrorToast, showSuccessToast } = useToaster();

  const initialValues: SnippetType = {
    title: snippet.title,
    description: snippet.description || '',
    content: snippet.content,
    isPrivate: snippet.isPrivate ?? false,
    language: snippet.language,
    collection: snippet.collection?.id || '',
  };

  async function updateSnippet(
    values: SnippetType,
    actions: FormikHelpers<SnippetType>
  ) {
    try {
      const res = await fetch(`${SITE_URL}/api/snippet?snipId=${snippet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.ok) showSuccessToast('Snippet updated.');
      else throw new Error(res.statusText || 'Something went wrong');
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to update snippet');
    } finally {
      actions.setSubmitting(false);
    }
  }

  return (
    <>
      <Meta title="Update snippet" />
      <AppLayout>
        <Container my={5} maxW="container.md">
          <SnippetForm
            initialValues={initialValues}
            onSubmit={updateSnippet}
            collections={collections}
            isUpdateForm
          />
        </Container>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const session = await getSession({ req });
  if (!session) return redirect('/auth/signin');
  const userId = session?.user.id;

  const snippet = await prisma.snippet.findFirst({
    where: {
      AND: [{ id: String(params?.snipId) }, { userId }],
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      language: true,
      isPrivate: true,
      collection: { select: { id: true } },
    },
  });

  if (!snippet) return { notFound: true };

  const collections = await prisma.collection.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: 'desc' },
  });

  return {
    props: { snippet, collections },
  };
};
