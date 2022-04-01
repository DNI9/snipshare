import React from 'react';

import {
  Button,
  Center,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type PageButtonProps = {
  disabled?: boolean;
  active?: boolean;
  buttonType?: 'BACKWARD' | 'FORWARD';
  onClick: (active: boolean, page: number) => void;
  page: number;
};

const PageButton: React.FC<PageButtonProps> = ({
  disabled = false,
  active = false,
  children,
  onClick,
  page,
}) => {
  const activeStyle = {
    bg: useColorModeValue('gray.600', 'gray.200'),
    color: useColorModeValue('white', 'gray.200'),
  };

  return (
    <Button
      onClick={() => onClick(active, page)}
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
      display={
        !active && typeof children === 'number'
          ? { base: 'none', sm: 'block' }
          : {}
      }
      {...(active && activeStyle)}
    >
      {children}
    </Button>
  );
};

type Props = {
  totalPages: number;
  currentPage?: number;
  explicitPath?: string;
};

export const Pagination: React.FC<Props> = ({
  totalPages,
  currentPage = 1,
  explicitPath,
}) => {
  const router = useRouter();

  if (totalPages < 2) return null;

  const pageNumClick = (active: boolean, page: number) => {
    if (!active) {
      router.push({
        pathname: explicitPath || router.pathname,
        query: { page },
      });
    }
  };

  return (
    <Center my={5} p={5}>
      <HStack>
        {currentPage !== 1 ? (
          <PageButton page={currentPage - 1} onClick={pageNumClick}>
            <Icon as={IoIosArrowBack} boxSize={4} />
          </PageButton>
        ) : null}

        {Array.from({ length: totalPages }).map((_, idx) => (
          <PageButton
            page={idx + 1}
            key={idx}
            active={idx + 1 === currentPage}
            onClick={pageNumClick}
          >
            {idx + 1}
          </PageButton>
        ))}

        {currentPage !== totalPages ? (
          <PageButton page={currentPage + 1} onClick={pageNumClick}>
            <Icon as={IoIosArrowForward} boxSize={4} />
          </PageButton>
        ) : null}
      </HStack>
    </Center>
  );
};
