import { SimpleGrid, Spacer } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import type { DefaultSession } from 'next-auth';
import { getSession } from 'next-auth/react';

import { CollectionCard, TitleRow } from '~/components/dashboard';
import { SnippetCard } from '~/components/snippet';
import { Meta, AppLayout } from '~/layout';
import { getSnippets } from '~/services/snippet';
import { SnippetWithLikes } from '~/types/snippet';

type Props = {
  user: DefaultSession['user'];
  snippets: SnippetWithLikes[];
};

const Index = ({ snippets }: Props) => {
  return (
    <>
      <Meta title="SnipShare" />
      <AppLayout>
        <Spacer my={5} />
        <TitleRow href="/collections" title="My collections" />
        <SimpleGrid mt={3} columns={{ sm: 2, md: 3 }} spacing={5}>
          <CollectionCard />
          <CollectionCard />
        </SimpleGrid>
        <Spacer my={5} />
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

  const snippets = await getSnippets(session.user.id);
  return {
    props: { user: session.user, snippets },
  };
};

export default Index;
