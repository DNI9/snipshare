import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import * as yup from 'yup';

import { prisma } from '~/lib/prisma';
import { CollectionSchema } from '~/schema/collection';

// POST /api/collection
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body)
      return res.status(400).send({ message: 'Collection data is required' });

    const session = await getSession({ req });
    if (!session) return res.status(401).send({ message: 'Unauthorized' });

    const collection = await CollectionSchema.validate(req.body);
    const { title, description, isPrivate } = collection;

    const data = await prisma.collection.create({
      data: {
        title,
        description,
        isPrivate,
        user: { connect: { id: session.user.id } },
      },
      select: { id: true },
    });

    return res.status(201).json(data);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    return res.status(500).json({ errors: 'something bad happened' });
  }
};

// Update snippet
const handlePATCH = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const collectionId = req.query?.id?.toString().trim();
    if (!collectionId) return res.status(400).json({ message: 'id required' });

    const collection = await CollectionSchema.validate(req.body);
    const { title, isPrivate, description } = collection;

    const session = await getSession({ req });
    if (!session) return res.status(401).send({ message: 'Unauthorized' });

    const existingCollection = await prisma.collection.findFirst({
      where: { id: collectionId, userId: session.user.id },
      select: { id: true },
    });
    if (!existingCollection)
      return res.status(401).send({ message: 'Unauthorized' });

    const data = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        title,
        description,
        isPrivate,
      },
      select: { id: true },
    });

    return res.json(data);
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
    case 'PATCH': {
      return handlePATCH(req, res);
    }
    default:
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
  }
}
