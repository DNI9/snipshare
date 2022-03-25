import { Container } from '@chakra-ui/react';
import { Snippet } from '@prisma/client';
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

type SnippetType = yup.InferType<typeof SnippetSchema>;

type Props = {
  snippet: Pick<
    Snippet,
    'id' | 'title' | 'description' | 'content' | 'isPrivate' | 'language'
  >;
};

export default function UpdateSnippet({ snippet }: Props) {
  const { showErrorToast, showSuccessToast } = useToaster();

  const initialValues: SnippetType = {
    title: snippet.title,
    description: snippet.description || '',
    content: snippet.content,
    isPrivate: snippet.isPrivate ?? false,
    language: snippet.language,
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
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  const snippet = await prisma.snippet.findFirst({
    where: {
      AND: [{ id: String(params?.snipId) }, { userId: session.user.id }],
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      language: true,
      isPrivate: true,
    },
  });

  if (!snippet) return { notFound: true };

  return {
    props: { snippet },
  };
};
