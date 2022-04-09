import { Grid, GridItem, Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { NextLink, Pagination } from '~/components/core';
import { CollectionCard } from '~/components/dashboard';
import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { getCollections } from '~/services/collection';
import { getSnippets } from '~/services/snippet';
import { getUniqueUser } from '~/services/user';
import { CollectionWithCount } from '~/types/collection';
import { SnippetData } from '~/types/snippet';
import { getPage, parseServerData } from '~/utils/next';

type Props = {
  collections: CollectionWithCount[];
  snippetData: SnippetData;
  isOwner: boolean;
};

export default function CollectionPage({
  collections,
  snippetData,
  isOwner,
}: Props) {
  const { query } = useRouter();

  return (
    <>
      <Meta title="My Collections" />
      <AppLayout containerProps={{ maxW: 'container.xl' }}>
        <Grid gap={5} gridTemplateColumns={{ sm: '1fr', lg: '1fr 2fr' }} mt={8}>
          <GridItem>
            <SimpleGrid
              pos="sticky"
              top="3"
              columns={{ md: 2, lg: 1 }}
              spacing={3}
              w="full"
            >
              {collections.map(collection => (
                <NextLink
                  key={collection.id}
                  href={`/${query.username}/collection/${collection.id}`}
                >
                  <CollectionCard
                    showEdit={isOwner}
                    collection={collection}
                    isActive={query?.collectionId === collection.id}
                  />
                </NextLink>
              ))}
            </SimpleGrid>
          </GridItem>
          <GridItem>
            <SimpleGrid columns={1} spacing={3}>
              {!snippetData.snippets.length ? (
                <Heading>No snippets available</Heading>
              ) : (
                snippetData.snippets.map(snippet => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    isSnippetOwner={snippet.isSnippetOwner}
                  />
                ))
              )}
            </SimpleGrid>
            <Spacer mb={2} />
            <Pagination
              totalPages={snippetData.totalPages}
              currentPage={snippetData.currentPage}
              explicitPath={`/${query.username}/collection/${query.collectionId}`}
            />
          </GridItem>
        </Grid>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  query,
}) => {
  const username = String(params?.username).trim();
  const collectionId = String(params?.collectionId).trim();
  const page = getPage(query.page);

  const session = await getSession({ req });
  const loggedInUser = session?.user.id;

  const user = await getUniqueUser({ username });
  if (!user) return { notFound: true };

  const isOwner = loggedInUser === user?.id;

  const collections = await getCollections({
    userId: user.id,
    ...(isOwner ? {} : { isPrivate: false }),
  });

  const collectionExists = collections.findIndex(c => c.id === collectionId);
  if (collectionExists < 0) return { notFound: true };

  const snippetData = await getSnippets(
    {
      userId: user.id,
      collectionId,
      ...(isOwner ? {} : { isPrivate: false }),
    },
    loggedInUser,
    page
  );

  if (page > snippetData.totalPages && snippetData.totalResults)
    return { notFound: true };

  return {
    props: {
      collections: parseServerData(collections),
      snippetData: parseServerData(snippetData),
      isOwner,
    },
  };
};
