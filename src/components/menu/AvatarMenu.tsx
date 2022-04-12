import {
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useConst,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import Router from 'next/router';
import { FiLogOut } from 'react-icons/fi';
import { ImUser } from 'react-icons/im';
import { IoMdBookmark } from 'react-icons/io';

import { useAuthSession } from '~/lib/hooks';

import { DarkModeMenu } from './DarkModeMenu';

export const AvatarMenu = () => {
  const { data } = useAuthSession();

  const menuItems = useConst([
    {
      title: 'Collections',
      icon: <IoMdBookmark size={20} />,
      onClick: () => {
        Router.push('/collections');
      },
    },
    {
      title: 'Profile',
      icon: <ImUser size={20} />,
      onClick: () => {
        Router.push(`/${data?.user.username}`);
      },
    },
    {
      title: 'Logout',
      icon: <FiLogOut size={20} />,
      onClick: () => signOut(),
    },
  ]);

  return (
    <Menu placement="bottom-end">
      <MenuButton>
        <Avatar
          showBorder
          name={data?.user?.name ?? 'Anon'}
          src={data?.user?.image ?? ''}
          size="sm"
        />
      </MenuButton>
      <MenuList>
        <DarkModeMenu />
        <MenuDivider />
        {menuItems.map(({ icon, onClick, title }) => (
          <MenuItem key={title} icon={icon} onClick={onClick}>
            {title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
