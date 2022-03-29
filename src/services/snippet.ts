import type { Prisma } from '@prisma/client';

import { DB_PAGE_LIMIT } from '~/constants';
import { prisma } from '~/lib/prisma';
import { SnippetData } from '~/types/snippet';

export const getSnippets = async (loggedInUser: string, skip?: number) => {
  const snippetWhere: Prisma.SnippetWhereInput = {
    userId: loggedInUser,
  };

  const snippets = await prisma.snippet.findMany({
    where: snippetWhere,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      language: true,
      createdAt: true,
      updatedAt: true,
      isPrivate: true,
      sourceSnippetId: true,
      userId: true,
      likes: {
        select: { userId: true },
        where: { userId: loggedInUser },
      },
      _count: { select: { likes: true } },
    },
    take: DB_PAGE_LIMIT,
    skip,
  });

  const totalSnippets = await prisma.snippet.count({ where: snippetWhere });

  const data: SnippetData = {
    totalResults: totalSnippets,
    totalPages: Math.ceil(totalSnippets / DB_PAGE_LIMIT),
    snippets: snippets.map(snippet => {
      const likes = snippet.likes.flatMap(x => x.userId);
      return {
        ...snippet,
        createdAt: snippet.updatedAt.toISOString(),
        updatedAt: snippet.updatedAt.toISOString(),
        likes,
        likedByCurrentUser: likes.length > 0,
        isSnippetOwner: true,
      };
    }),
  };
  return data;
};

type PublicSnippetArgs = {
  loggedInUser?: string;
  queryUserId?: string;
  skip?: number;
};

export const getPublicSnippets = async ({
  loggedInUser,
  queryUserId,
  skip,
}: PublicSnippetArgs) => {
  const snippetWhere: Prisma.SnippetWhereInput = {
    isPrivate: false,
    ...(queryUserId ? { userId: queryUserId } : {}),
    NOT: [{ userId: loggedInUser }],
  };

  const snippets = await prisma.snippet.findMany({
    where: snippetWhere,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      language: true,
      createdAt: true,
      updatedAt: true,
      isPrivate: true,
      userId: true,
      sourceSnippetId: true,
      user: { select: { id: true, username: true, name: true, image: true } },
      likes: { select: { userId: true } },
      _count: { select: { likes: true } },
    },
    take: DB_PAGE_LIMIT,
    skip,
  });

  const totalSnippets = await prisma.snippet.count({ where: snippetWhere });

  const data: SnippetData = {
    totalResults: totalSnippets,
    totalPages: Math.ceil(totalSnippets / DB_PAGE_LIMIT),
    snippets: snippets.map(snippet => {
      const likes = snippet.likes.flatMap(x => x.userId);
      const likedByCurrentUser = loggedInUser
        ? likes.includes(loggedInUser)
        : false;
      const isSnippetOwner = snippet.userId === loggedInUser;

      return {
        ...snippet,
        createdAt: snippet.updatedAt.toISOString(),
        updatedAt: snippet.updatedAt.toISOString(),
        likes,
        likedByCurrentUser,
        isSnippetOwner,
      };
    }),
  };

  return data;
};
