import { Heading, Text } from '@chakra-ui/react';

import { Meta, AppLayout } from '~/layout';

const Index = () => {
  return (
    <>
      <Meta title="SnipShare" />
      <AppLayout>
        <Heading as="h1">SnipShare</Heading>
        <Text>Create, Share &amp; Explore code snippets</Text>
      </AppLayout>
    </>
  );
};

export default Index;
