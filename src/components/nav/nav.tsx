import { Avatar, Button, Heading, HStack, Tag } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiLogIn } from 'react-icons/fi';

import { AppConfig } from '~/utils/AppConfig';

import { NextLink } from '../core';
import { AppMenu } from '../menu';

export const Nav = () => {
  const session = useSession();

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
        {session.status === 'authenticated' ? (
          <>
            <NextLink href="/create">
              <Button
                leftIcon={<AiOutlinePlus size={22} />}
                colorScheme="blue"
                variant="solid"
                size="sm"
              >
                Create
              </Button>
            </NextLink>
            <AppMenu>
              <Avatar
                showBorder
                name={session.data?.user?.name ?? 'Anon'}
                src={session.data?.user?.image ?? ''}
                size="sm"
              />
            </AppMenu>
          </>
        ) : (
          <NextLink href="/auth/signin">
            <Button
              leftIcon={<FiLogIn size={18} />}
              colorScheme="blue"
              variant="solid"
              size="sm"
            >
              Login
            </Button>
          </NextLink>
        )}
      </HStack>
    </HStack>
  );
};
