import { SimpleGrid } from '@chakra-ui/react';
import type { Snippet } from '@prisma/client';
import { GetServerSideProps } from 'next';
import type { DefaultSession } from 'next-auth';
import { getSession } from 'next-auth/react';

import { CollectionCard, SnippetCard, TitleRow } from '~/components/dashboard';
import { Meta, AppLayout } from '~/layout';
import { prisma } from '~/lib/prisma';

type Props = {
  user: DefaultSession['user'];
  snippets: Snippet[];
};

const Index = ({ snippets }: Props) => {
  return (
    <>
      <Meta title="SnipShare" />
      <AppLayout>
        <TitleRow href="/collections" title="My collections" />
        <SimpleGrid mt={3} columns={{ sm: 2, md: 3 }} spacing={5}>
          <CollectionCard />
          <CollectionCard />
        </SimpleGrid>
        <TitleRow href="/snippets" title="Recent snippets" />
        <SimpleGrid my={3} columns={{ lg: 2 }} spacing={5}>
          {snippets.map(snippet => (
            <SnippetCard key={snippet.id} snippet={snippet} isSnippetOwner />
          ))}
        </SimpleGrid>
      </AppLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/explore',
        permanent: false,
      },
    };
  }

  const snippets = await prisma.snippet.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      title: true,
      content: true,
      language: true,
      createdAt: true,
      updatedAt: true,
    },
    take: 6,
  });

  return {
    props: {
      user: session.user,
      snippets: snippets.map(snippet => ({
        ...snippet,
        createdAt: snippet.updatedAt.toISOString(),
        updatedAt: snippet.updatedAt.toISOString(),
      })),
    },
  };
};

export default Index;
