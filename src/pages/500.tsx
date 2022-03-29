import { Heading, Text, Button, Flex } from '@chakra-ui/react';
import { AiOutlineReload } from 'react-icons/ai';

import { Meta } from '~/layout';

export default function ServerNuked() {
  return (
    <>
      <Meta title="Server Nuked" />
      <Flex
        align="center"
        justify="center"
        minH={'100vh'}
        flexDirection="column"
      >
        <Heading
          display="inline-block"
          as="h1"
          size="4xl"
          bgGradient="linear(to-r, blue.400, purple.300)"
          backgroundClip="text"
        >
          500
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Server might be dead or busy!
        </Text>
        <Text color={'gray.500'} mb={6}>
          It seems like server could not handle your request and gave up.
        </Text>

        <Button
          onClick={() => window.location.reload()}
          leftIcon={<AiOutlineReload size={20} />}
          _hover={{ bg: 'blue.300' }}
          bg="blue.400"
          color="white"
          variant="solid"
        >
          Reload
        </Button>
      </Flex>
    </>
  );
}
