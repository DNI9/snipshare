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
import { FormikHelpers } from 'formik';
import router from 'next/router';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiFolderPlus } from 'react-icons/bi';
import { GoFileCode } from 'react-icons/go';

import { SITE_URL } from '~/constants';
import { useToaster } from '~/lib/hooks';
import { CollectionSchemaType } from '~/types/collection';

import { CollectionForm } from '../forms';

const initialValues: CollectionSchemaType = {
  title: '',
  description: '',
  isPrivate: false,
};

export const CreateMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const { showErrorToast, showSuccessToast } = useToaster();

  async function postCollection(
    values: CollectionSchemaType,
    actions: FormikHelpers<CollectionSchemaType>
  ) {
    try {
      const res = await fetch(`${SITE_URL}/api/collection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.ok) showSuccessToast('collection created.');
      else throw new Error(res.statusText || 'Something went wrong');
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to create collection');
    } finally {
      onClose();
      actions.setSubmitting(false);
    }
  }

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
                  initialValues={initialValues}
                  onSubmit={postCollection}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </MenuList>
      </Menu>
    </>
  );
};
