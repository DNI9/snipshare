import type { Prisma } from '@prisma/client';

import { DB_PAGE_LIMIT } from '~/constants';
import { prisma } from '~/lib/prisma';
import { SnippetData, SnippetWithLikes } from '~/types/snippet';

export const getSnippets = async (userId: string) => {
  const data = await prisma.snippet.findMany({
    where: { user: { id: userId } },
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
        where: { userId },
      },
      _count: { select: { likes: true } },
    },
    take: 6,
  });

  const snippets: SnippetWithLikes[] = data.map(snippet => {
    const likes = snippet.likes.flatMap(x => x.userId);
    return {
      ...snippet,
      createdAt: snippet.updatedAt.toISOString(),
      updatedAt: snippet.updatedAt.toISOString(),
      likes,
      likedByCurrentUser: likes.length > 0,
    };
  });
  return snippets;
};

export const getPublicSnippets = async (userId?: string) => {
  const snippetWhere: Prisma.SnippetWhereInput = {
    isPrivate: false,
    NOT: [{ userId }],
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
  });

  const totalSnippets = await prisma.snippet.count({ where: snippetWhere });

  const data: SnippetData = {
    totalResults: totalSnippets,
    totalPages: Math.ceil(totalSnippets / DB_PAGE_LIMIT),
    snippets: snippets.map(snippet => {
      const likes = snippet.likes.flatMap(x => x.userId);
      const likedByCurrentUser = userId ? likes.includes(userId) : false;
      const isSnippetOwner = snippet.userId === userId;

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
