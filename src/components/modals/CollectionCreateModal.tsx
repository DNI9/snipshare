import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import { FormikHelpers } from 'formik';

import { SITE_URL } from '~/constants';
import { useToaster } from '~/lib/hooks';
import { CollectionSchemaType } from '~/types/collection';

import { CollectionForm } from '../forms';

type Props = {
  modalProps: Pick<UseDisclosureReturn, 'isOpen' | 'onClose'>;
};

const initialValues: CollectionSchemaType = {
  title: '',
  description: '',
  isPrivate: false,
};

export const CollectionCreateModal: React.FC<Props> = ({ modalProps }) => {
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
      modalProps.onClose();
      actions.setSubmitting(false);
    }
  }

  return (
    <>
      <Modal {...modalProps}>
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
    </>
  );
};
