import { SimpleGrid } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { getPublicSnippets } from '~/services/snippet';
import { SnippetData } from '~/types/snippet';

type Props = {
  data: SnippetData;
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
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  return { props: { data: await getPublicSnippets(session?.user.id) } };
};
