import { Grid, GridItem, SimpleGrid } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { ProfileSidebar } from '~/components/profile';
import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { prisma } from '~/lib/prisma';
import { SnippetWithLikes } from '~/types/snippet';
import { UserWithCounts } from '~/types/user';

type Props = {
  user: UserWithCounts;
  snippets: SnippetWithLikes[];
};

export default function PublicProfile({ user, snippets }: Props) {
  return (
    <>
      <Meta title={`${user.name}'s Profile`} />
      <AppLayout>
        <Grid
          gap={5}
          my={3}
          gridTemplateColumns={{ sm: '1fr', lg: '1fr 2fr' }}
          mt={8}
        >
          <ProfileSidebar user={user} />
          <GridItem>
            <SimpleGrid columns={1} spacing={5}>
              {snippets.map(snippet => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </SimpleGrid>
          </GridItem>
        </Grid>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const username = String(params?.username).trim();
  const session = await getSession({ req });

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, name: true, image: true },
  });

  if (!user) return { notFound: true };
  if (session && user.id === session.user.id) {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    };
  }

  const snippets = await prisma.snippet.findMany({
    where: { isPrivate: false, userId: user.id },
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
      likes: { select: { userId: true } },
      _count: { select: { likes: true } },
    },
    take: 10,
  });

  const snippetCount = await prisma.snippet.count({
    where: { isPrivate: false, userId: user.id },
  });

  return {
    props: {
      user: {
        ...user,
        _count: { snippets: snippetCount, collections: 0 }, // TODO: add collection count
      },
      snippets: snippets.map(snippet => {
        const likes = snippet.likes.flatMap(x => x.userId);
        const likedByCurrentUser = session
          ? likes.includes(session.user.id)
          : false;

        return {
          ...snippet,
          createdAt: snippet.updatedAt.toISOString(),
          updatedAt: snippet.updatedAt.toISOString(),
          likes,
          likedByCurrentUser,
        };
      }),
    },
  };
};
