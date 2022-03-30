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
  BoxProps,
  VStack,
  Badge,
  Tag,
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
import { useToaster } from '~/lib/hooks';
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
  const { showErrorToast, showSuccessToast } = useToaster();
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
        showErrorToast(
          `Failed to ${snippet.likedByCurrentUser ? 'dislike' : 'like'} snippet`
        );
        setLiked.toggle();
      }
    );
  };

  const handleFork = () => {
    forkSnippet(snippet, () => showSuccessToast(`Snippet forked`));
  };

  const debouncedLike = useCallback(
    debounce(() => handleLike(), 500),
    []
  );

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

        <VStack align="start" spacing={1}>
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
            else showErrorToast(`Please login to like this snippet`);
          }}
          iconButtonProps={{
            color: liked ? 'red.500' : 'inherit',
            disabled: !isLoggedIn,
            title: !isLoggedIn ? 'Login to like snippet' : '',
            _disabled: { color: 'gray', cursor: 'not-allowed' },
          }}
        />
        <SnipIconButton
          label="Copy snippet"
          icon={hasCopied ? <IoMdDoneAll /> : <FaClone />}
          onClick={onCopy}
        />
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
