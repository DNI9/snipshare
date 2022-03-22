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

// GET /api/snippet
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const session = await getSession({ req });

    let snippets;
    if (session) {
      snippets = await prisma.snippet.findMany({
        where: { user: { id: session.user.id } },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          content: true,
          language: true,
          createdAt: true,
          updatedAt: true,
          isPrivate: true,
          likes: {
            select: { userId: true },
            where: { userId: session.user.id },
          },
          _count: { select: { likes: true } },
        },
        take: Number(limit),
        skip,
      });
    } else {
      snippets = await prisma.snippet.findMany({
        where: { isPrivate: false },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          content: true,
          language: true,
          createdAt: true,
          updatedAt: true,
          isPrivate: true,
          user: { select: { username: true, name: true } },
          likes: { select: { userId: true } },
          _count: { select: { likes: true } },
        },
        take: Number(limit),
        skip,
      });
    }
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
    const { title, isPrivate, content, description, language } = snippet;

    const updatedSnippet = await prisma.snippet.update({
      where: { id: String(snipId) },
      data: {
        title,
        content,
        description,
        language,
        isPrivate,
      },
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
    default:
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
  }
}
