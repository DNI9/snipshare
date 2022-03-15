import { GetServerSideProps } from 'next';
import { DefaultSession } from 'next-auth';
import { getSession } from 'next-auth/react';

import { TitleRow } from '~/components/dashboard';
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
