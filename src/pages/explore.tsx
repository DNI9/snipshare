import { Center, SimpleGrid, Text } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { EmptyView } from '~/components/common';
import { Pagination } from '~/components/core';
import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { getPublicSnippets } from '~/services/snippet';
import { SnippetData, SnippetType } from '~/types/snippet';
import { getQueryString } from '~/utils/next';

type Props = {
  data: SnippetData;
  search: string | undefined;
};

const EmptyMessage = ({ search }: { search: string }) => (
  <Center flexDir="column">
    <Text fontSize="2xl" mt={3} mb={2}>
      No results
    </Text>
    <Text color={'gray.500'} mb={6}>
      There is nothing with <strong>{search}</strong>
    </Text>
  </Center>
);

const Snippets = ({ data }: { data: SnippetType[] }) => (
  <SimpleGrid my={3} columns={1} spacing={5}>
    {data.map(snippet => (
      <SnippetCard
        isPublic
        key={snippet.id}
        snippet={snippet}
        isSnippetOwner={snippet.isSnippetOwner}
      />
    ))}
  </SimpleGrid>
);

export default function Explore({ data, search }: Props) {
  if (!data.totalResults && !search)
    return (
      <EmptyView description="No one made their snippets public, that's why it's empty here" />
    );

  return (
    <>
      <Meta title="Explore SnipShare" />
      <AppLayout containerProps={{ maxW: 'container.md' }}>
        {search && !data.snippets.length ? (
          <EmptyMessage search={search} />
        ) : (
          <Snippets data={data.snippets} />
        )}
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
  res,
}) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  const search = getQueryString(query.q);
  const page = Number(query.page) || 1;
  const session = await getSession({ req });

  const data = await getPublicSnippets({
    loggedInUser: session?.user.id,
    searchQuery: search,
    page,
  });

  if (!!data.totalResults && page > data.totalPages) return { notFound: true };

  return { props: { data, search: search || '' } };
};
