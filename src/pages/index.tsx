import { Grid, GridItem, SimpleGrid, Spacer } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { NextLink } from '~/components/core';
import { CollectionCard, TitleRow } from '~/components/dashboard';
import { SnippetCard } from '~/components/snippet';
import { Meta, AppLayout } from '~/layout';
import { getCollections } from '~/services/collection';
import { getSnippets } from '~/services/snippet';
import { CollectionWithCount } from '~/types/collection';
import { SnippetData } from '~/types/snippet';
import { parseServerData, redirect } from '~/utils/next';

type Props = {
  data: SnippetData;
  collections: CollectionWithCount[];
};

const Index = ({ data, collections }: Props) => {
  return (
    <>
      <Meta title="SnipShare" />
      <AppLayout>
        <Spacer my={5} />
        <TitleRow href="/collections" title="My collections" />
        <SimpleGrid mt={3} columns={{ sm: 2, md: 3 }} spacing={5}>
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
        <TitleRow href="/snippets" title="Recent snippets" />
        <Grid
          my={3}
          gap={5}
          templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        >
          {data.snippets.map(snippet => (
            <GridItem key={snippet.id}>
              <SnippetCard snippet={snippet} isSnippetOwner />
            </GridItem>
          ))}
        </Grid>
      </AppLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) return redirect('/explore');

  const userId = session?.user.id;
  const data = await getSnippets({ userId });
  const collections = await getCollections({ userId });

  return {
    props: {
      data,
      collections: parseServerData(collections),
    },
  };
};

export default Index;
