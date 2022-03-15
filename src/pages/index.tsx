import { Heading, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { DefaultSession } from 'next-auth';
import { getSession } from 'next-auth/react';

import { Meta, AppLayout } from '~/layout';

type Props = {
  user: DefaultSession['user'];
};

const Index: React.FC<Props> = ({ user }) => {
  return (
    <>
      <Meta title="SnipShare" />
      <AppLayout user={user}>
        <Heading as="h1">SnipShare</Heading>
        <Text>Create, Share &amp; Explore code snippets</Text>
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
