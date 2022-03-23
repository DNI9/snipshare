import { prisma } from '~/lib/prisma';

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      _count: {
        select: { snippets: true, collections: true },
      },
    },
  });

  return user;
};
