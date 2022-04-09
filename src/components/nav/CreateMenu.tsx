import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react';
import router from 'next/router';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiFolderPlus } from 'react-icons/bi';
import { GoFileCode } from 'react-icons/go';

import { CollectionCreateModal } from '../modals';

export const CreateMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          leftIcon={<AiOutlinePlus size={22} />}
          colorScheme="blue"
          variant="solid"
          size="sm"
        >
          Create
        </MenuButton>
        <MenuList>
          <MenuItem
            icon={<GoFileCode size={22} />}
            onClick={() => router.push('/create')}
          >
            snippet
          </MenuItem>
          <MenuItem icon={<BiFolderPlus size={22} />} onClick={onOpen}>
            collection
          </MenuItem>
          <CollectionCreateModal modalProps={{ isOpen, onClose }} />
        </MenuList>
      </Menu>
    </>
  );
};
