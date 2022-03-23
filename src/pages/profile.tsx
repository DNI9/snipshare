import { Grid, GridItem, SimpleGrid, Spacer } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { CollectionCard, TitleRow } from '~/components/dashboard';
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

export default function Profile({ user, snippets }: Props) {
  return (
    <>
      <Meta title="Profile" />
      <AppLayout>
        <Grid gap={5} gridTemplateColumns={{ sm: '1fr', lg: '1fr 2fr' }} mt={8}>
          <ProfileSidebar user={user} />
          <GridItem>
            <TitleRow href="/collections" title="Collections" />
            <SimpleGrid mt={3} columns={{ sm: 2 }} spacing={5}>
              <CollectionCard />
              <CollectionCard />
            </SimpleGrid>
            <Spacer my={5} />
            <TitleRow href="#" title="Snippets" />
            <SimpleGrid my={3} columns={1} spacing={5}>
              {snippets.map(snippet => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  isSnippetOwner
                />
              ))}
            </SimpleGrid>
          </GridItem>
        </Grid>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      _count: {
        select: { snippets: true, collections: true },
      },
    },
  });

  const snippets = await prisma.snippet.findMany({
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
    take: 6,
  });

  return {
    props: {
      user,
      snippets: snippets.map(snippet => {
        const likes = snippet.likes.flatMap(x => x.userId);
        return {
          ...snippet,
          createdAt: snippet.updatedAt.toISOString(),
          updatedAt: snippet.updatedAt.toISOString(),
          likes,
          likedByCurrentUser: likes.includes(session.user.id),
        };
      }),
    },
  };
};
