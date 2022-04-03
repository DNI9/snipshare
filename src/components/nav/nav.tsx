import { Avatar, Button, Heading, HStack, Spacer, Tag } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiLogIn } from 'react-icons/fi';

import { AppConfig } from '~/utils/AppConfig';

import { NextLink } from '../core';
import { AppMenu } from '../menu';
import { CreateMenu } from './CreateMenu';

export const Nav = () => {
  const session = useSession();
  const router = useRouter();

  const isLinkActive = (link: string) => router.pathname.includes(link);

  return (
    <HStack
      py={2}
      px={5}
      mb={3}
      boxShadow="md"
      justify={'space-between'}
      align="center"
    >
      <HStack spacing={3}>
        <NextLink href="/">
          <Heading size="lg">{AppConfig.site_name}</Heading>
        </NextLink>
        <Spacer mx={2} />
        <NextLink href={`/explore`}>
          <Tag
            _hover={{ bg: 'blue.200' }}
            bg={isLinkActive('/explore') ? 'blue.100' : 'transparent'}
            rounded="full"
          >
            explore
          </Tag>
        </NextLink>
        {session.status === 'authenticated' ? (
          <NextLink href={`/collections`}>
            <Tag
              _hover={{ bg: 'blue.200' }}
              bg={isLinkActive('/collections') ? 'blue.100' : 'transparent'}
              rounded="full"
            >
              collections
            </Tag>
          </NextLink>
        ) : null}
      </HStack>

      <HStack spacing={5}>
        {session.status === 'authenticated' ? (
          <>
            <CreateMenu />
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
