import { MenuButton, MenuList, MenuItem, Menu } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import Router from 'next/router';
import { FiLogOut } from 'react-icons/fi';
import { ImUser } from 'react-icons/im';
import { IoMdBookmark } from 'react-icons/io';

const menuItems = [
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
      Router.push('/profile');
    },
  },
  {
    title: 'Logout',
    icon: <FiLogOut size={20} />,
    onClick: () => signOut(),
  },
];

export const AppMenu: React.FC = ({ children }) => {
  return (
    <Menu>
      <MenuButton>{children}</MenuButton>
      <MenuList>
        {menuItems.map(({ icon, onClick, title }) => (
          <MenuItem key={title} icon={icon} onClick={onClick}>
            {title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
