import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Show,
  useDisclosure,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineMenu } from 'react-icons/hi';

import { useAuthSession } from '~/lib/hooks';

import { CollectionCreateModal } from '../modals';
import { Search } from './Search';

export const MobileMenu = () => {
  const router = useRouter();
  const { data, isLoggedIn } = useAuthSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const goto = (url: string) => router.push(url);

  return (
    <Menu>
      <MenuButton>
        <IconButton
          variant="ghost"
          aria-label="Mobile menu"
          fontSize="lg"
          icon={<HiOutlineMenu />}
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => goto('/explore')}>Explore</MenuItem>
        <MenuDivider />
        {isLoggedIn ? (
          <>
            <MenuItem onClick={() => goto('/create')}>Create Snippet</MenuItem>
            <>
              <MenuItem onClick={onOpen}>Create Collection</MenuItem>
              <CollectionCreateModal modalProps={{ isOpen, onClose }} />
            </>
            <MenuDivider />
            <MenuItem onClick={() => goto(`/${data?.user.username}`)}>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => goto('/collections')}>
              Collections
            </MenuItem>
            <MenuItem onClick={() => signOut()}>Logout</MenuItem>
          </>
        ) : (
          <MenuItem onClick={() => goto('/auth/signin')}>Login</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export const MobileSearch = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Show breakpoint="(max-width: 62em)">
        <IconButton
          onClick={onOpen}
          variant="ghost"
          aria-label="Mobile menu"
          fontSize="lg"
          icon={<FiSearch />}
        />
      </Show>
      <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <Search />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
