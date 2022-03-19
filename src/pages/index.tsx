import { SimpleGrid } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { CollectionCard, SnippetCard, TitleRow } from '~/components/dashboard';
import { Meta, AppLayout } from '~/layout';

const Index = () => {
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
          <SnippetCard />
          <SnippetCard />
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

  return {
    props: { user: session.user },
  };
};

export default Index;
