import { Avatar, useConst } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import Router from 'next/router';
import { FiLogOut } from 'react-icons/fi';
import { ImUser } from 'react-icons/im';
import { IoMdBookmark } from 'react-icons/io';

import { useAuthSession } from '~/lib/hooks';

import { CoreMenu } from './menu';

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
    <CoreMenu items={menuItems}>
      <Avatar
        showBorder
        name={data?.user?.name ?? 'Anon'}
        src={data?.user?.image ?? ''}
        size="sm"
      />
    </CoreMenu>
  );
};
