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
import { AiOutlineFileSearch } from 'react-icons/ai';
import { BiFolderPlus } from 'react-icons/bi';
import { FiLogIn, FiLogOut, FiSearch } from 'react-icons/fi';
import { GoFileCode } from 'react-icons/go';
import { HiOutlineMenu } from 'react-icons/hi';
import { ImUser } from 'react-icons/im';
import { MdLibraryBooks } from 'react-icons/md';

import { useAuthSession } from '~/lib/hooks';

import { DarkModeMenu } from '../menu/DarkModeMenu';
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
        <DarkModeMenu />
        <MenuItem
          icon={<AiOutlineFileSearch size={20} />}
          onClick={() => goto('/explore')}
        >
          Explore
        </MenuItem>
        <MenuDivider />
        {isLoggedIn ? (
          <>
            <MenuItem
              icon={<GoFileCode size={20} />}
              onClick={() => goto('/create')}
            >
              Create Snippet
            </MenuItem>
            <>
              <MenuItem icon={<BiFolderPlus size={20} />} onClick={onOpen}>
                Create Collection
              </MenuItem>
              <CollectionCreateModal modalProps={{ isOpen, onClose }} />
            </>
            <MenuDivider />

            <MenuItem
              icon={<MdLibraryBooks size={20} />}
              onClick={() => goto('/collections')}
            >
              Collections
            </MenuItem>
            <MenuItem
              icon={<ImUser size={20} />}
              onClick={() => goto(`/${data?.user.username}`)}
            >
              My Profile
            </MenuItem>
            <MenuItem icon={<FiLogOut size={20} />} onClick={() => signOut()}>
              Logout
            </MenuItem>
          </>
        ) : (
          <MenuItem
            icon={<FiLogIn size={20} />}
            onClick={() => goto('/auth/signin')}
          >
            Login
          </MenuItem>
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
