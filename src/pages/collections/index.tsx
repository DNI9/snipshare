import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { prisma } from '~/lib/prisma';
import { redirect } from '~/utils/next';

export default function Collections() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) return { notFound: true };

  const data = await prisma.collection.findFirst({
    where: { userId: session?.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  if (!data) return { notFound: true };

  return redirect(`/collections/${data.id}`);
};
