import { useCallback } from 'react';

import type { BoxProps } from '@chakra-ui/layout';
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useBoolean,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsLight';
import { BiGitRepoForked } from 'react-icons/bi';
import { FaClone, FaHeart } from 'react-icons/fa';
import { IoMdDoneAll } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { format } from 'timeago.js';

import { SITE_URL } from '~/constants';
import { SnippetWithLikes } from '~/types/snippet';

import { NextLink } from '../core';

const MotionBox = motion<BoxProps>(Box);

type Props = {
  snippet: SnippetWithLikes;
  isSnippetOwner?: boolean;
};

export const SnippetCard: React.FC<Props> = ({
  snippet,
  isSnippetOwner = false,
}) => {
  const { hasCopied, onCopy } = useClipboard(snippet.content);
  const [liked, setLiked] = useBoolean(snippet.likedByCurrentUser);
  const toast = useToast();

  const likeSnippet = async () => {
    setLiked.toggle();
    try {
      const res = await fetch(`${SITE_URL}/api/snippet/like/${snippet.id}`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Failed to like/dislike snippet');
    } catch (error) {
      toast({
        title: `Failed to ${
          snippet.likedByCurrentUser ? 'dislike' : 'like'
        } snippet`,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
      setLiked.toggle();
    }
  };

  const debouncedLike = useCallback(
    debounce(() => likeSnippet(), 500),
    []
  );

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
        <Heading size="md">{snippet.title}</Heading>
        <Spacer />
        {!isSnippetOwner ? (
          <Tooltip label="Fork snippet" placement="top">
            <IconButton
              variant="ghost"
              aria-label="Fork snippet"
              fontSize="lg"
              icon={<BiGitRepoForked />}
            />
          </Tooltip>
        ) : (
          <NextLink href={`/update/${snippet.id}`}>
            <Tooltip label="Edit snippet" placement="top">
              <IconButton
                variant="ghost"
                aria-label="Edit snippet"
                fontSize="lg"
                icon={<MdEdit />}
              />
            </Tooltip>
          </NextLink>
        )}
        <Tooltip
          label={`${liked ? 'Dislike' : 'Like'} this snippet`}
          placement="top"
        >
          <IconButton
            onClick={debouncedLike}
            variant="ghost"
            aria-label="Like this snippet"
            color={liked ? 'red.500' : 'inherit'}
            fontSize="lg"
            icon={<FaHeart />}
          />
        </Tooltip>
        <Tooltip label="Copy snippet" placement="top">
          <IconButton
            onClick={onCopy}
            variant="ghost"
            aria-label="Copy snippet"
            fontSize="lg"
            icon={hasCopied ? <IoMdDoneAll /> : <FaClone />}
          />
        </Tooltip>
      </HStack>
      <Text color="gray" fontSize="sm">
        {format(snippet.updatedAt)}
      </Text>
      <Box p={2} mt={2}>
        <Highlight
          {...defaultProps}
          code={snippet.content}
          language={snippet.language as Language}
          theme={theme}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Box
              border="1px"
              borderColor="gray.100"
              p={2}
              rounded="md"
              as="pre"
              overflowX="auto"
              className={className}
              style={style}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </Box>
          )}
        </Highlight>
      </Box>
    </MotionBox>
  );
};
