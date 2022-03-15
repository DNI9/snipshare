import { Heading, Text, Button, Flex } from '@chakra-ui/react';
import { AiFillHome } from 'react-icons/ai';

import { NextLink } from '~/components/core';

export default function NotFound() {
  return (
    <Flex align="center" justify="center" minH={'100vh'} flexDirection="column">
      <Heading
        display="inline-block"
        as="h1"
        size="4xl"
        bgGradient="linear(to-r, blue.400, purple.300)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={'gray.500'} mb={6}>
        The page you are looking for does not seem to exist
      </Text>

      <NextLink href="/">
        <Button
          leftIcon={<AiFillHome size={20} />}
          _hover={{ bg: 'blue.300' }}
          bg="blue.400"
          color="white"
          variant="solid"
        >
          Go to Home
        </Button>
      </NextLink>
    </Flex>
  );
}
