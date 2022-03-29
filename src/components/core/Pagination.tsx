import React from 'react';

import { Button, Center, HStack, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';

type PageButtonProps = {
  disabled?: boolean;
  active?: boolean;
  page: number;
};

const PageButton: React.FC<PageButtonProps> = ({
  disabled = false,
  active = false,
  page,
}) => {
  const router = useRouter();

  const activeStyle = {
    bg: useColorModeValue('gray.600', 'gray.200'),
    color: useColorModeValue('white', 'gray.200'),
  };

  const pageNumClick = () => {
    if (!active) {
      router.push({
        pathname: router.pathname,
        query: { page },
      });
    }
  };

  return (
    <Button
      onClick={pageNumClick}
      mx={1}
      px={3}
      py={2}
      rounded="md"
      disabled={disabled}
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.700', 'gray.200')}
      opacity={disabled ? 0.8 : 'initial'}
      _hover={!disabled ? activeStyle : {}}
      _disabled={disabled ? activeStyle : {}}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      display={!active ? { base: 'none', sm: 'block' } : {}}
      {...(active && activeStyle)}
    >
      {page}
    </Button>
  );
};

type Props = {
  totalPages: number;
  currentPage?: number;
};

export const Pagination: React.FC<Props> = ({
  totalPages,
  currentPage = 1,
}) => {
  if (totalPages < 2) return null;

  return (
    <Center my={5} p={5}>
      <HStack>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <PageButton
            key={idx}
            page={idx + 1}
            active={idx + 1 === currentPage}
          />
        ))}
      </HStack>
    </Center>
  );
};
