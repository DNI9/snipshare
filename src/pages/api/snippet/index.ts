import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import * as yup from 'yup';

import { prisma } from '~/lib/prisma';
import { SnippetSchema } from '~/schema/snippet';

// POST /api/snippet
// Required fields in body: title, language, content
// Optional fields: description, likes, isPrivate
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) return res.status(401).send({ message: 'Unauthorized' });

    const snippet = await SnippetSchema.validate(req.body);
    const { title, isPrivate, content, description, language } = snippet;

    const result = await prisma.snippet.create({
      data: {
        title,
        content,
        description,
        language,
        isPrivate,
        user: { connect: { email: session.user?.email! } },
      },
    });
    return res.json(result);
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
  if (req.method === 'POST') {
    handlePOST(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
