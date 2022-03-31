import { Grid, GridItem, SimpleGrid, Spacer } from '@chakra-ui/react';
import { Collection } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { NextLink, Pagination } from '~/components/core';
import { CollectionCard, TitleRow } from '~/components/dashboard';
import { ProfileSidebar } from '~/components/profile';
import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { getCollections } from '~/services/collection';
import { getSnippets } from '~/services/snippet';
import { getUserById } from '~/services/user';
import { SnippetData } from '~/types/snippet';
import { UserWithCounts } from '~/types/user';
import { parseServerData, redirect } from '~/utils/next';

type Props = {
  user: UserWithCounts;
  data: SnippetData;
  collections: Collection[];
};

export default function Profile({ user, data, collections }: Props) {
  return (
    <>
      <Meta title="Profile" />
      <AppLayout>
        <Grid gap={5} gridTemplateColumns={{ sm: '1fr', lg: '1fr 2fr' }} mt={8}>
          <ProfileSidebar user={user} />
          <GridItem>
            <TitleRow href="/collections" title="Collections" />
            <SimpleGrid mt={3} columns={{ sm: 2 }} spacing={5}>
              {collections.map(collection => (
                <NextLink
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                >
                  <CollectionCard collection={collection} />
                </NextLink>
              ))}
            </SimpleGrid>
            <Spacer my={5} />
            <TitleRow href="#" title="Snippets" />
            <SimpleGrid my={3} columns={1} spacing={5}>
              {data.snippets.map(snippet => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  isSnippetOwner
                />
              ))}
            </SimpleGrid>
            <Pagination
              totalPages={data.totalPages}
              currentPage={data.currentPage}
            />
          </GridItem>
        </Grid>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const page = Number(query.page) || 1;
  const session = await getSession({ req });
  if (!session) return redirect('/auth/signin');

  const userId = session?.user.id;
  const user = await getUserById(userId);
  const data = await getSnippets(userId, page);
  const collections = await getCollections(userId);

  if (page > data.totalPages) return { notFound: true };

  return {
    props: {
      user,
      data,
      collections: parseServerData(collections),
    },
  };
};
