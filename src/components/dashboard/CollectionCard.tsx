import type { StackProps } from '@chakra-ui/layout';
import { Heading, HStack, Text, useToken, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { IoMdBookmark } from 'react-icons/io';

const MotionVStack = motion<StackProps>(VStack);

export const CollectionCard = () => {
  const [blue200] = useToken('colors', ['blue.400']);

  return (
    <MotionVStack
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      _hover={{
        boxShadow: 'xl',
        border: '1px',
        borderColor: 'gray.100',
      }}
      border="1px"
      borderColor="gray.50"
      boxShadow="md"
      cursor="pointer"
      rounded="md"
      maxW={400}
      minH={120}
      p={3}
      align="start"
    >
      <HStack justify={'space-between'} align="center" w="full">
        <IoMdBookmark size={25} color={blue200} />
        <FaLock size={12} color="gray" />
      </HStack>
      <Heading size="md">Web stuffs</Heading>
      <Text>all web related snippets</Text>
      <Text color="gray" fontSize="sm">
        22 snippets
      </Text>
    </MotionVStack>
  );
};
