import { Grid, GridItem, Heading, SimpleGrid } from '@chakra-ui/react';

import { CollectionCard } from '~/components/dashboard';
import { AppLayout, Meta } from '~/layout';

export default function Collections() {
  return (
    <>
      <Meta title="My Collections" />
      <AppLayout containerProps={{ maxW: 'container.xl' }}>
        <Grid gap={5} gridTemplateColumns={{ sm: '1fr', lg: '1fr 2fr' }} mt={8}>
          <GridItem border="1px" p={2}>
            <SimpleGrid columns={1} spacing={3}>
              <CollectionCard />
              <CollectionCard />
              <CollectionCard />
            </SimpleGrid>
          </GridItem>
          <GridItem>
            <Heading>Empty</Heading>
          </GridItem>
        </Grid>
      </AppLayout>
    </>
  );
}
