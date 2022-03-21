import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { prisma } from '~/lib/prisma';

// PUT /api/snippet/like
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { snipId } = req.query;
    const session = await getSession({ req });
    if (!session) return res.status(401).send({ message: 'Unauthorized' });

    const likedSnippet = await prisma.like.findFirst({
      where: {
        AND: [{ snippetId: String(snipId) }, { userId: session.user.id }],
      },
      select: { id: true },
    });

    if (likedSnippet) {
      await prisma.like.delete({ where: { id: likedSnippet.id } });
      return res.json({ liked: false });
    }

    await prisma.like.create({
      data: { snippetId: String(snipId), userId: session.user.id },
    });
    return res.json({ liked: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: 'something bad happened' });
  }
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT': {
      return handlePUT(req, res);
    }
    default:
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
  }
}
