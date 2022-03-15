import { Avatar, Button, Heading, HStack, Tag } from '@chakra-ui/react';
import { DefaultSession } from 'next-auth';
import { AiOutlinePlus } from 'react-icons/ai';

import { AppConfig } from '~/utils/AppConfig';

import { NextLink } from '../core';
import { AppMenu } from '../menu';

type Props = {
  user: DefaultSession['user'];
};

export const Nav: React.FC<Props> = ({ user }) => {
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
        <NextLink href="/">
          <Heading size="lg">{AppConfig.site_name}</Heading>
        </NextLink>
        <NextLink href="/explore">
          <Tag _hover={{ bg: 'blue.100' }} bg="transparent" rounded="full">
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
        {user ? (
          <AppMenu>
            <Avatar
              showBorder
              name={user?.name ?? 'Anon'}
              src={user?.image ?? ''}
              h="45px"
              w="45px"
            />
          </AppMenu>
        ) : null}
      </HStack>
    </HStack>
  );
};
