import { SimpleGrid } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { DefaultSession } from 'next-auth';
import { getSession } from 'next-auth/react';

import { CollectionCard, SnippetCard, TitleRow } from '~/components/dashboard';
import { Meta, AppLayout } from '~/layout';

type Props = {
  user: DefaultSession['user'];
};

const Index: React.FC<Props> = ({ user }) => {
  return (
    <>
      <Meta title="SnipShare" />
      <AppLayout user={user}>
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
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
};

export default Index;
