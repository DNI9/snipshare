import { useState } from 'react';

import {
  Avatar,
  Box,
  Heading,
  HStack,
  Text,
  Tooltip,
  useBoolean,
  BoxProps,
  VStack,
  Badge,
  Tag,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { format } from 'timeago.js';

import { NextLink, CodeHighlighter } from '~/components/core';
import { SnippetType } from '~/types/snippet';

import { SnippetButtons } from './SnippetButtons';

const MotionBox = motion<BoxProps>(Box);

type Props = {
  snippet: SnippetType;
  isSnippetOwner?: boolean;
  isPublic?: boolean;
};

export const SnippetCard: React.FC<Props> = ({ snippet, isPublic = false }) => {
  const privateBadge = snippet.isPrivate ? (
    <Badge colorScheme="blue" p={1} title="Private snippet">
      <FaLock size={12} />
    </Badge>
  ) : null;

  const forkBadge = snippet.sourceSnippetId ? (
    <Badge colorScheme="yellow" p={1}>
      Forked
    </Badge>
  ) : null;

  const [isContentBig, toggleBigContentBar] = useBoolean(
    snippet.content.length > 450
  );

  const [content, setContent] = useState(() => {
    return isContentBig ? snippet.content.slice(0, 450) : snippet.content;
  });

  return (
    <MotionBox
      whileHover={{ scale: 1.01 }}
      _hover={{
        boxShadow: 'xl',
        border: '1px',
        borderColor: 'gray.100',
      }}
      p={3}
      rounded="md"
      border="1px"
      borderColor="gray.50"
      boxShadow="md"
    >
      <HStack>
        {isPublic ? (
          <NextLink href={`/profile/${snippet.user?.username}`}>
            <Tooltip
              hasArrow
              label={`Open ${snippet.user?.username}'s profile`}
              placement="top"
            >
              <Avatar
                loading="lazy"
                cursor="pointer"
                showBorder
                name={snippet.user?.name ?? ''}
                src={snippet.user?.image ?? ''}
                size="md"
              />
            </Tooltip>
          </NextLink>
        ) : null}

        <VStack align="start" spacing={1} w="full">
          <Heading size="md">
            {snippet.title}{' '}
            {!isPublic && (
              <HStack ml={1} spacing={1} display="inline-block">
                {privateBadge}
                {forkBadge}
              </HStack>
            )}
          </Heading>
          <Text color="gray" fontSize="sm">
            {format(snippet.updatedAt)}
          </Text>
        </VStack>

        <SnippetButtons snippet={snippet} />
      </HStack>

      <Box
        mt={2}
        border="2px"
        borderColor="blue.300"
        rounded="md"
        pos="relative"
      >
        <CodeHighlighter
          snippet={{ content, language: snippet.language }}
          editorProps={{ readOnly: true }}
        />
        {isContentBig && (
          <Tag
            onClick={() => {
              toggleBigContentBar.toggle();
              setContent(snippet.content);
            }}
            pos="absolute"
            top="0"
            right="0"
            rounded="none"
            colorScheme="blue"
            cursor="pointer"
          >
            View full snippet
          </Tag>
        )}
      </Box>
    </MotionBox>
  );
};
