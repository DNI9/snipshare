import { Button, Heading, HStack, Show, Spacer, Tag } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiLogIn } from 'react-icons/fi';

import { useAuthSession } from '~/lib/hooks';
import { AppConfig } from '~/utils/AppConfig';

import { NextLink } from '../core';
import { AvatarMenu } from '../menu';
import { CreateMenu } from './CreateMenu';
import { MobileMenu, MobileSearch } from './MobileMenu';
import { Search } from './Search';

export const Nav = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuthSession();

  const isLinkActive = (link: string) => router.pathname.includes(link);

  return (
    <HStack py={2} px={5} mb={3} boxShadow="md" align="center">
      <HStack spacing={3} mr="auto">
        <NextLink href="/">
          <Heading size="lg">{AppConfig.site_name}</Heading>
        </NextLink>
        <Show breakpoint="(min-width: 40em)">
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
          {isLoggedIn && (
            <NextLink href={`/collections`}>
              <Tag
                _hover={{ bg: 'blue.200' }}
                bg={isLinkActive('/collections') ? 'blue.100' : 'transparent'}
                rounded="full"
              >
                collections
              </Tag>
            </NextLink>
          )}
        </Show>
      </HStack>

      <MobileSearch />

      <Show breakpoint="(min-width: 40em)">
        <HStack spacing={5}>
          <Show breakpoint="(min-width: 62em)">
            <Search />
          </Show>
          {isLoggedIn ? (
            <>
              <CreateMenu />
              <AvatarMenu />
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
      </Show>

      <Show breakpoint="(max-width: 40em)">
        <MobileMenu />
      </Show>
    </HStack>
  );
};
