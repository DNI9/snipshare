import { prisma } from '~/lib/prisma';
import { SnippetWithLikes } from '~/types/snippet';

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
