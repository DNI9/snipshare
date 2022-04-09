import {
  Button,
  Center,
  Grid,
  GridItem,
  SimpleGrid,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { NextLink, Pagination } from '~/components/core';
import { CollectionCard, TitleRow } from '~/components/dashboard';
import { ProfileSidebar } from '~/components/profile';
import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { useAuthSession } from '~/lib/hooks';
import { getCollections } from '~/services/collection';
import { getSnippets } from '~/services/snippet';
import { getUniqueUser } from '~/services/user';
import { CollectionWithCount } from '~/types/collection';
import { SnippetData } from '~/types/snippet';
import { UserWithCounts } from '~/types/user';
import { getPage, parseServerData } from '~/utils/next';

type Props = {
  user: UserWithCounts;
  data: SnippetData;
  isOwner: boolean;
  collections: CollectionWithCount[];
};

export default function UserProfile({
  user,
  data,
  collections,
  isOwner,
}: Props) {
  const { isLoggedIn } = useAuthSession();

  return (
    <>
      <Meta title="Profile" />
      <AppLayout>
        <Grid gap={5} gridTemplateColumns={{ sm: '1fr', lg: '1fr 2fr' }} mt={8}>
          <ProfileSidebar user={user} />
          <GridItem>
            {collections.length ? (
              <>
                <TitleRow
                  href={isLoggedIn ? '/collections' : ''}
                  title="Collections"
                />
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
            {data.snippets?.length ? (
              <>
                <TitleRow title="Snippets" />
                <SimpleGrid my={3} columns={1} spacing={5}>
                  {data.snippets.map(snippet => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      isSnippetOwner={snippet.isSnippetOwner}
                    />
                  ))}
                </SimpleGrid>
                <Pagination
                  totalPages={data.totalPages}
                  currentPage={data.currentPage}
                  explicitPath={`/${user.username}`}
                />
              </>
            ) : (
              <Center flexDir="column">
                <Text fontSize="2xl" mt={3} mb={2}>
                  No Snippets available
                </Text>
                {isOwner && (
                  <NextLink href="/create">
                    <Button size="sm" colorScheme="blue">
                      Create one
                    </Button>
                  </NextLink>
                )}
              </Center>
            )}
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

  const page = getPage(query.page);
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
    loggedInUser,
    page
  );
  const collections = await getCollections({
    userId: user?.id,
    ...(isOwner ? {} : { isPrivate: false }),
  });

  if (!!data.totalResults && page > data.totalPages) return { notFound: true };

  return {
    props: {
      isOwner,
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
