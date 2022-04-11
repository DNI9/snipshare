import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import * as yup from 'yup';

import { prisma } from '~/lib/prisma';
import { SnippetSchema } from '~/schema/snippet';
import { getPublicSnippets, getSnippets } from '~/services/snippet';

// POST /api/snippet
// Required fields in body: title, language, content
// Optional fields: description, likes, isPrivate
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) return res.status(401).send({ message: 'Unauthorized' });

    const snippet = await SnippetSchema.validate(req.body);
    const { title, isPrivate, content, description, language, collection } =
      snippet;

    const result = await prisma.snippet.create({
      data: {
        title,
        content,
        description,
        language,
        isPrivate,
        user: { connect: { email: session.user?.email! } },
        ...(collection ? { collection: { connect: { id: collection } } } : {}),
      },
      select: { id: true },
    });
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    return res.status(500).json({ errors: 'something bad happened' });
  }
};

// GET /api/snippet
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const page = Number(req.query.page) || 1;
    const session = await getSession({ req });

    const snippets = session
      ? await getSnippets({ userId: session.user.id }, session.user.id, page)
      : await getPublicSnippets({ page });

    return res.json(snippets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: 'something bad happened' });
  }
};

// Update snippet
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { snipId } = req.query;
    const session = await getSession({ req });
    if (!session) return res.status(401).send({ message: 'Unauthorized' });

    const snippet = await SnippetSchema.validate(req.body);
    const { title, isPrivate, content, description, language, collection } =
      snippet;

    const updatedSnippet = await prisma.snippet.update({
      where: { id: String(snipId) },
      data: {
        title,
        content,
        description,
        language,
        isPrivate,
        collection: {
          ...(collection
            ? { connect: { id: collection } }
            : { disconnect: true }),
        },
      },
      select: { id: true },
    });

    return res.json({ id: updatedSnippet.id });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    return res.status(500).json({ errors: 'something bad happened' });
  }
};

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const snipId = req.query?.id;
    if (!snipId || typeof snipId !== 'string')
      return res.status(400).send({ message: 'Snippet id is required' });

    const session = await getSession({ req });
    if (!session) return res.status(401).send({ message: 'Unauthorized' });

    const { count } = await prisma.snippet.deleteMany({
      where: { AND: [{ id: snipId }, { userId: session.user.id }] },
    });
    return res.json({ deleted: !!count });
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
    case 'POST': {
      return handlePOST(req, res);
    }
    case 'GET': {
      return handleGET(req, res);
    }
    case 'PUT': {
      return handlePUT(req, res);
    }
    case 'DELETE': {
      return handleDELETE(req, res);
    }
    default:
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
  }
}
