import { useToast } from '@chakra-ui/react';

export const useToaster = () => {
  const toast = useToast({ isClosable: true, position: 'top-right' });

  const showSuccessToast = (msg: string) => {
    toast({ title: msg, status: 'success' });
  };

  const showErrorToast = (msg: string) => {
    toast({ title: msg, status: 'error' });
  };

  return { showSuccessToast, showErrorToast };
};
