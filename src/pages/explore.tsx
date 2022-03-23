import { SimpleGrid } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { SnippetCard } from '~/components/dashboard';
import { AppLayout, Meta } from '~/layout';
import { prisma } from '~/lib/prisma';
import { SnippetWithLikes } from '~/types/snippet';

type Props = {
  snippets: SnippetWithLikes[];
};

export default function Explore({ snippets }: Props) {
  return (
    <>
      <Meta title="Explore SnipShare" />
      <AppLayout containerProps={{ maxW: 'container.md' }}>
        <SimpleGrid my={3} columns={1} spacing={5}>
          {snippets.map(snippet => (
            <SnippetCard
              showAvatar
              key={snippet.id}
              snippet={snippet}
              isSnippetOwner={snippet.isSnippetOwner}
            />
          ))}
        </SimpleGrid>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  const snippets = await prisma.snippet.findMany({
    where: { isPrivate: false, NOT: [{ userId: session?.user.id }] },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      language: true,
      createdAt: true,
      updatedAt: true,
      isPrivate: true,
      user: { select: { id: true, username: true, name: true, image: true } },
      likes: { select: { userId: true } },
      _count: { select: { likes: true } },
    },
    take: 10,
  });

  return {
    props: {
      snippets: snippets.map(snippet => {
        const likes = snippet.likes.flatMap(x => x.userId);
        const likedByCurrentUser = session
          ? likes.includes(session.user.id)
          : false;
        const isSnippetOwner = snippet.user.id === session?.user.id;

        return {
          ...snippet,
          createdAt: snippet.updatedAt.toISOString(),
          updatedAt: snippet.updatedAt.toISOString(),
          likes,
          likedByCurrentUser,
          isSnippetOwner,
        };
      }),
    },
  };
};
