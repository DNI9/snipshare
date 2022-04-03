import { useRef } from 'react';

import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import router from 'next/router';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiFolderPlus } from 'react-icons/bi';
import { GoFileCode } from 'react-icons/go';

import { CollectionForm } from '../forms';

export const CreateMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

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
          <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create a collection</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <CollectionForm
                  initialValues={{
                    title: '',
                    description: '',
                    isPrivate: false,
                  }}
                  onSubmit={(values, actions) => {
                    console.log(values);
                    actions.setSubmitting(false);
                  }}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </MenuList>
      </Menu>
    </>
  );
};
