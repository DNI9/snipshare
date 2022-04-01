import { Prisma } from '@prisma/client';

import { prisma } from '~/lib/prisma';

export const getUniqueUser = async (filter: Prisma.UserWhereUniqueInput) => {
  const user = await prisma.user.findUnique({
    where: filter,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      username: true,
    },
  });

  return user;
};
