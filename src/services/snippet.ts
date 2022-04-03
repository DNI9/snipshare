import type { Prisma } from '@prisma/client';

import { DB_PAGE_LIMIT } from '~/constants';
import { prisma } from '~/lib/prisma';
import { SnippetData } from '~/types/snippet';
import { getSkip, getTotalPages } from '~/utils/db';

export const getSnippets = async (
  filter: Prisma.SnippetWhereInput,
  loggedInUser?: string,
  page: number = 1
) => {
  const snippets = await prisma.snippet.findMany({
    where: filter,
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
      collectionId: true,
      likes: {
        select: { userId: true },
        where: { userId: filter.userId },
      },
      _count: { select: { likes: true } },
    },
    take: DB_PAGE_LIMIT,
    skip: getSkip(page),
  });

  const totalSnippets = await prisma.snippet.count({ where: filter });

  const data: SnippetData = {
    currentPage: page,
    totalResults: totalSnippets,
    totalPages: getTotalPages(totalSnippets),

    snippets: snippets.map(snippet => {
      const isSnippetOwner = snippet.userId === loggedInUser;
      const likes = snippet.likes.flatMap(x => x.userId);

      return {
        ...snippet,
        createdAt: snippet.updatedAt.toISOString(),
        updatedAt: snippet.updatedAt.toISOString(),
        likes,
        likedByCurrentUser: likes.length > 0,
        isSnippetOwner,
      };
    }),
  };
  return data;
};

type PublicSnippetArgs = {
  loggedInUser?: string;
  queryUserId?: string;
  page?: number;
};

export const getPublicSnippets = async ({
  loggedInUser,
  queryUserId,
  page = 1,
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
      collectionId: true,
      user: { select: { id: true, username: true, name: true, image: true } },
      likes: { select: { userId: true } },
      _count: { select: { likes: true } },
    },
    take: DB_PAGE_LIMIT,
    skip: getSkip(page),
  });

  const totalSnippets = await prisma.snippet.count({ where: snippetWhere });

  const data: SnippetData = {
    currentPage: page,
    totalResults: totalSnippets,
    totalPages: getTotalPages(totalSnippets),
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
