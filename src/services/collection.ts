import { Prisma } from '@prisma/client';

import { prisma } from '~/lib/prisma';

export const getCollections = async (filter: Prisma.CollectionWhereInput) => {
  const collections = await prisma.collection.findMany({
    where: filter,
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { snippets: true } },
    },
  });

  return collections;
};
