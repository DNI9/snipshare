import { Button, Grid, GridItem, SimpleGrid, Spacer } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';

import { EmptyView } from '~/components/common';
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
  const session = useSession();

  if (!data.snippets?.length && !collections.length)
    return (
      <EmptyView description="No snippets or collection available, try creating a snippet with below button">
        <NextLink href="/create">
          <Button colorScheme="blue">Create snippet</Button>
        </NextLink>
      </EmptyView>
    );

  return (
    <>
      <Meta title="SnipShare" />
      <AppLayout>
        <Spacer my={5} />
        {collections?.length ? (
          <>
            <TitleRow href="/collections" title="My collections" />
            <SimpleGrid mt={3} columns={{ sm: 2, md: 3 }} spacing={5}>
              {collections.map(collection => (
                <NextLink
                  key={collection.id}
                  href={`/${session.data?.user.username}/collection/${collection.id}`}
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
            <TitleRow title="Recent snippets" />
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
          </>
        ) : null}
      </AppLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) return redirect('/explore');

  const userId = session?.user.id;
  const data = await getSnippets({ userId }, userId);
  const collections = await getCollections({ userId });

  return {
    props: {
      data,
      collections: parseServerData(collections),
    },
  };
};

export default Index;
