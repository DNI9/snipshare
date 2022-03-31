import type { StackProps } from '@chakra-ui/layout';
import { Heading, HStack, Text, useToken, VStack } from '@chakra-ui/react';
import { Collection } from '@prisma/client';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { IoMdBookmark } from 'react-icons/io';

const MotionVStack = motion<StackProps>(VStack);

type Props = {
  collection: Collection;
  isActive?: boolean;
};

export const CollectionCard = ({ collection, isActive = false }: Props) => {
  const [blue200] = useToken('colors', ['blue.400']);

  return (
    <MotionVStack
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      _hover={{
        boxShadow: 'xl',
        border: '1px',
        borderColor: isActive ? 'blue.300' : 'gray.200',
      }}
      border="1px"
      borderColor={isActive ? 'blue.300' : 'gray.50'}
      bg={isActive ? 'blue.50' : ''}
      boxShadow="md"
      cursor="pointer"
      rounded="md"
      minH={120}
      p={3}
      align="start"
    >
      <HStack justify={'space-between'} align="center" w="full">
        <IoMdBookmark size={25} color={blue200} />
        {collection.isPrivate && <FaLock size={12} color="gray" />}
      </HStack>
      <Heading size="md">{collection.title}</Heading>
      {collection.description && <Text>{collection.description}</Text>}
      <Text color="gray" fontSize="sm">
        22 snippets
      </Text>
    </MotionVStack>
  );
};
