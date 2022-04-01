import { Grid, GridItem, SimpleGrid, Spacer } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { NextLink, Pagination } from '~/components/core';
import { CollectionCard, TitleRow } from '~/components/dashboard';
import { ProfileSidebar } from '~/components/profile';
import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { getCollections } from '~/services/collection';
import { getSnippets } from '~/services/snippet';
import { getUniqueUser } from '~/services/user';
import { CollectionWithCount } from '~/types/collection';
import { SnippetData } from '~/types/snippet';
import { UserWithCounts } from '~/types/user';
import { parseServerData } from '~/utils/next';

type Props = {
  user: UserWithCounts;
  data: SnippetData;
  collections: CollectionWithCount[];
};

export default function UserProfile({ user, data, collections }: Props) {
  return (
    <>
      <Meta title="Profile" />
      <AppLayout>
        <Grid gap={5} gridTemplateColumns={{ sm: '1fr', lg: '1fr 2fr' }} mt={8}>
          <ProfileSidebar user={user} />
          <GridItem>
            {collections.length ? (
              <>
                <TitleRow href="/collections" title="Collections" />
                <SimpleGrid mt={3} columns={{ sm: 2 }} spacing={5}>
                  {collections.map(collection => (
                    <NextLink
                      key={collection.id}
                      href={`/${user.username}/collection/${collection.id}`}
                    >
                      <CollectionCard collection={collection} />
                    </NextLink>
                  ))}
                </SimpleGrid>
                <Spacer my={5} />
              </>
            ) : null}
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
              explicitPath={`/${user.username}`}
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
  params,
}) => {
  const username = String(params?.username).trim();

  const page = Number(query.page) || 1;
  const session = await getSession({ req });
  const loggedInUser = session?.user.id;

  const user = await getUniqueUser({ username });
  if (!user) return { notFound: true };

  const isOwner = loggedInUser === user?.id;

  const data = await getSnippets(
    {
      userId: user?.id,
      ...(isOwner ? {} : { isPrivate: false }),
    },
    page
  );
  const collections = await getCollections({
    userId: user?.id,
    ...(isOwner ? {} : { isPrivate: false }),
  });

  if (page > data.totalPages) return { notFound: true };

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
