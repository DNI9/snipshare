import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

import { prisma } from '~/lib/prisma';
import { redirect } from '~/utils/next';

export default function Collections() {
  return (
    <>
      <Head>
        <title>Redirecting...</title>
      </Head>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) return { notFound: true };

  const collection = await prisma.collection.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  if (!collection) return { notFound: true };

  return redirect(`/${session.user.username}/collection/${collection.id}`);
};
