import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import * as yup from 'yup';

import { prisma } from '~/lib/prisma';
import { SnippetSchema } from '~/schema/snippet';

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { snipId } = req.query;
    if (!snipId)
      return res.status(400).send({ message: 'Snippet Id is required' });

    const session = await getSession({ req });
    if (!session) return res.status(401).send({ message: 'Unauthorized' });

    const alreadyForked = await prisma.snippet.findFirst({
      where: {
        AND: [{ sourceSnippetId: String(snipId) }, { userId: session.user.id }],
      },
      select: { id: true },
    });
    if (alreadyForked)
      return res.status(400).send({ message: 'Snippet already forked' });

    const snippet = await SnippetSchema.validate(req.body);
    const { title, isPrivate, content, description, language } = snippet;

    await prisma.snippet.create({
      data: {
        title,
        content,
        description,
        language,
        isPrivate,
        user: { connect: { id: session.user.id } },
        sourceSnippet: { connect: { id: String(snipId) } },
      },
      select: { id: true },
    });

    return res.json({ forked: true });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    return res.status(500).json({ errors: 'something bad happened' });
  }
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST': {
      return handlePOST(req, res);
    }
    default:
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
  }
}
