import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { EmptyView } from '~/components/common';
import { prisma } from '~/lib/prisma';
import { redirect } from '~/utils/next';

export default function Collections() {
  return (
    <EmptyView description="No collections available, try creating a collection with create button on navbar." />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) return { notFound: true };

  const collection = await prisma.collection.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  if (!collection) return { props: {} };

  return redirect(`/${session.user.username}/collection/${collection.id}`);
};
