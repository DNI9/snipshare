import { useCallback, useState } from 'react';

import {
  Avatar,
  Box,
  Heading,
  HStack,
  Spacer,
  Text,
  Tooltip,
  useBoolean,
  useClipboard,
  useToast,
  BoxProps,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import { useSession } from 'next-auth/react';
import { BiGitRepoForked } from 'react-icons/bi';
import { FaClone, FaHeart, FaLock } from 'react-icons/fa';
import { IoMdDoneAll } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { format } from 'timeago.js';

import { NextLink, CodeHighlighter } from '~/components/core';
import { forkSnippet } from '~/services/client/fork';
import { likeSnippet } from '~/services/client/like';
import { SnippetWithLikes } from '~/types/snippet';

import { SnipIconButton } from './SnipIconButton';

const MotionBox = motion<BoxProps>(Box);

type Props = {
  snippet: SnippetWithLikes;
  isSnippetOwner?: boolean;
  isPublic?: boolean;
};

export const SnippetCard: React.FC<Props> = ({
  snippet,
  isSnippetOwner = false,
  isPublic = false,
}) => {
  const { hasCopied, onCopy } = useClipboard(snippet.content);
  const [liked, setLiked] = useBoolean(snippet.likedByCurrentUser);
  const toast = useToast();
  const session = useSession();
  const isLoggedIn = session.status === 'authenticated';

  // eslint-disable-next-line no-underscore-dangle
  const [likes, setLikes] = useState(snippet._count.likes);

  const handleLike = () => {
    setLiked.toggle();
    likeSnippet(
      snippet.id,
      data => setLikes(count => (data.liked ? count + 1 : count - 1)),
      () => {
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
    );
  };

  const handleFork = () => {
    forkSnippet(snippet, () => {
      toast({
        title: `Snippet forked`,
        status: 'success',
        isClosable: true,
        position: 'top-right',
      });
    });
  };

  const debouncedLike = useCallback(
    debounce(() => handleLike(), 500),
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

        <VStack align="start" spacing={1}>
          <Heading size="md">
            {snippet.title}{' '}
            {!isPublic && snippet.isPrivate ? (
              <Badge
                colorScheme="blue"
                p={1}
                rounded="full"
                title="Private snippet"
              >
                <FaLock size={12} />
              </Badge>
            ) : null}
          </Heading>
          <Text color="gray" fontSize="sm">
            {format(snippet.updatedAt)}
          </Text>
        </VStack>

        <Spacer />

        {!isSnippetOwner ? (
          <>
            {isLoggedIn ? (
              <SnipIconButton
                label="Fork snippet"
                onClick={handleFork}
                icon={<BiGitRepoForked />}
              />
            ) : null}
          </>
        ) : (
          <SnipIconButton
            href={`/update/${snippet.id}`}
            label="Edit snippet"
            icon={<MdEdit />}
          />
        )}
        <SnipIconButton
          label={`${liked ? 'Dislike' : 'Like'} snippet`}
          icon={
            <HStack px={2}>
              <FaHeart />
              {!!likes && (
                <Badge bg="transparent" fontSize="md">
                  {likes}
                </Badge>
              )}
            </HStack>
          }
          onClick={() => {
            if (isLoggedIn) debouncedLike();
            else
              toast({
                title: `Please login to like this snippet`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
              });
          }}
          iconButtonProps={{
            color: liked ? 'red.500' : 'inherit',
            disabled: !isLoggedIn,
            title: !isLoggedIn ? 'Login to like post' : '',
            _disabled: { color: 'gray', cursor: 'not-allowed' },
          }}
        />
        <SnipIconButton
          label="Copy snippet"
          icon={hasCopied ? <IoMdDoneAll /> : <FaClone />}
          onClick={onCopy}
        />
      </HStack>

      <Box p={2} mt={2}>
        <CodeHighlighter snippet={snippet} />
      </Box>
    </MotionBox>
  );
};
