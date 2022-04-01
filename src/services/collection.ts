import { prisma } from '~/lib/prisma';

export const getCollections = async (userId?: string) => {
  const collections = await prisma.collection.findMany({
    where: { userId, ...(!userId ? { isPrivate: false } : {}) },
    orderBy: { updatedAt: 'desc' },
  });

  return collections;
};
