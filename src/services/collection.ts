import { Prisma } from '@prisma/client';

import { DB_PAGE_LIMIT } from '~/constants';
import { prisma } from '~/lib/prisma';
import { SnippetData } from '~/types/snippet';
import { getSkip, getTotalPages } from '~/utils/db';

export const getCollections = async (userId?: string) => {
  const collections = await prisma.collection.findMany({
    where: { userId, ...(!userId ? { isPrivate: false } : {}) },
    orderBy: { updatedAt: 'desc' },
  });

  return collections;
};

export const getSnippets = async (
  filter: Prisma.SnippetWhereInput,
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
