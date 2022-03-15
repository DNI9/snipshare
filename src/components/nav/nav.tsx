import { Avatar, Button, Heading, HStack, Tag } from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';

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
        <NextLink href="/explore">
          <Tag _hover={{ bg: 'blue.100' }} rounded="full">
            explore
          </Tag>
        </NextLink>
      </HStack>
      <HStack spacing={5}>
        <NextLink href="/collection">
          <Button
            leftIcon={<AiOutlinePlus size={22} />}
            colorScheme="blue"
            variant="outline"
          >
            Create
          </Button>
        </NextLink>
        <Avatar name="DNI9" size="md" />
      </HStack>
    </HStack>
  );
};
