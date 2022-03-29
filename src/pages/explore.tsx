import { SimpleGrid } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { Pagination } from '~/components/core';
import { SnippetCard } from '~/components/snippet';
import { DB_PAGE_LIMIT } from '~/constants';
import { AppLayout, Meta } from '~/layout';
import { getPublicSnippets } from '~/services/snippet';
import { SnippetData } from '~/types/snippet';

type Props = {
  data: SnippetData & { currentPage: number };
};

export default function Explore({ data }: Props) {
  return (
    <>
      <Meta title="Explore SnipShare" />
      <AppLayout containerProps={{ maxW: 'container.md' }}>
        <SimpleGrid my={3} columns={1} spacing={5}>
          {data.snippets.map(snippet => (
            <SnippetCard
              isPublic
              key={snippet.id}
              snippet={snippet}
              isSnippetOwner={snippet.isSnippetOwner}
            />
          ))}
        </SimpleGrid>
        <Pagination
          totalPages={data.totalPages}
          currentPage={data.currentPage}
        />
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const page = Number(query.page) || 1;
  const session = await getSession({ req });

  const data = await getPublicSnippets({
    loggedInUser: session?.user.id,
    skip: (page - 1) * DB_PAGE_LIMIT,
  });

  if (page > data.totalPages) return { notFound: true };

  return {
    props: {
      data: { ...data, currentPage: page },
    },
  };
};
