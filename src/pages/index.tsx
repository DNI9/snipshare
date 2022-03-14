import { Center, Heading, Text } from '@chakra-ui/react';

import { Meta } from '@/layout/Meta';

const Index = () => {
  return (
    <div>
      <Meta title="SnipShare" />
      <Center flexDirection="column" mt={55}>
        <Heading as="h1">SnipShare</Heading>
        <Text>Create, Share &amp; Explore code snippets</Text>
      </Center>
    </div>
  );
};

export default Index;
