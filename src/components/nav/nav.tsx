import { Avatar, Box, Heading, HStack } from '@chakra-ui/react';

import { AppConfig } from '~/utils/AppConfig';

import { NextLink } from '../core';

export const Nav = () => {
  return (
    <HStack
      py={2}
      px={5}
      mb={3}
      boxShadow="md"
      justify={'space-between'}
      align="center"
    >
      <HStack spacing={5}>
        <Heading size="lg">{AppConfig.site_name}</Heading>
        <NextLink href="/explore">explore</NextLink>
      </HStack>
      <Box>
        <Avatar name="DNI9" size="md" />
      </Box>
    </HStack>
  );
};
