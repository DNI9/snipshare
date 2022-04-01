import { Grid, GridItem, Heading, SimpleGrid } from '@chakra-ui/react';
import { Collection } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { NextLink } from '~/components/core';
import { CollectionCard } from '~/components/dashboard';
import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { getCollections } from '~/services/collection';
import { getSnippets } from '~/services/snippet';
import { SnippetData } from '~/types/snippet';
import { parseServerData } from '~/utils/next';

type Props = {
  collections: Collection[];
  snippetData: SnippetData | null;
};

export default function CollectionPage({ collections, snippetData }: Props) {
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
                  href={`/collections/${collection.id}`}
                >
                  <CollectionCard
                    collection={collection}
                    isActive={query?.collectionId === collection.id}
                  />
                </NextLink>
              ))}
            </SimpleGrid>
          </GridItem>
          <GridItem>
            <SimpleGrid columns={1} spacing={3}>
              {!snippetData ? (
                <Heading>No snippets available</Heading>
              ) : (
                snippetData.snippets.map(snippet => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))
              )}
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
  const collectionId = String(params?.collectionId).trim();

  const session = await getSession({ req });
  const userId = session?.user.id;

  const collections = await getCollections(userId);
  const collectionExists = collections.findIndex(c => c.id === collectionId);
  if (collectionExists < 0) return { notFound: true };

  const snippetData = collectionId
    ? await getSnippets({
        userId,
        collectionId,
        ...(!userId ? { isPrivate: false } : {}),
      })
    : null;

  return {
    props: {
      collections: parseServerData(collections),
      snippetData: snippetData?.snippets.length
        ? parseServerData(snippetData)
        : null,
    },
  };
};
