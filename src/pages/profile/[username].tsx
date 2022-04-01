import { Grid, GridItem, SimpleGrid, Spacer } from '@chakra-ui/react';
import { Collection } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { NextLink } from '~/components/core';
import { CollectionCard, TitleRow } from '~/components/dashboard';
import { ProfileSidebar } from '~/components/profile';
import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { prisma } from '~/lib/prisma';
import { getCollections } from '~/services/collection';
import { getPublicSnippets } from '~/services/snippet';
import { SnippetData } from '~/types/snippet';
import { UserWithCounts } from '~/types/user';
import { parseServerData, redirect } from '~/utils/next';

type Props = {
  user: UserWithCounts;
  data: SnippetData;
  collections: Collection[];
};

export default function PublicProfile({ user, data, collections }: Props) {
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
            {collections.length ? (
              <>
                <TitleRow href="/collections" title="Collections" />
                <SimpleGrid mt={3} columns={{ sm: 2 }} spacing={5}>
                  {collections.map(collection => (
                    <NextLink
                      key={collection.id}
                      href={`/collections/${user.username}/${collection.id}`}
                    >
                      <CollectionCard collection={collection} />
                    </NextLink>
                  ))}
                </SimpleGrid>
                <Spacer my={5} />
              </>
            ) : null}

            <SimpleGrid columns={1} spacing={5}>
              {data.snippets.map(snippet => (
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
    select: { id: true, name: true, image: true, username: true },
  });

  if (!user) return { notFound: true };
  if (session && user.id === session.user.id) return redirect('/profile');

  const data = await getPublicSnippets({
    loggedInUser: session?.user.id,
    queryUserId: user?.id,
  });
  const collections = await getCollections({
    userId: user.id,
    isPrivate: false,
  });

  return {
    props: {
      user: {
        ...user,
        _count: {
          snippets: data.totalResults,
          collections: collections.length,
        },
      },
      data,
      collections: parseServerData(collections),
    },
  };
};
