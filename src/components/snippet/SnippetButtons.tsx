import { useCallback, useState } from 'react';

import { Badge, HStack, useBoolean, useClipboard } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useSession } from 'next-auth/react';
import { BiGitRepoForked } from 'react-icons/bi';
import { FaClone, FaHeart } from 'react-icons/fa';
import { IoMdDoneAll } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';

import { useToaster } from '~/lib/hooks';
import { forkSnippet } from '~/services/client/fork';
import { likeSnippet } from '~/services/client/like';
import { SnippetType } from '~/types/snippet';

import { SnipIconButton } from './SnipIconButton';

type Props = {
  snippet: SnippetType;
};

export const SnippetButtons: React.FC<Props> = ({ snippet }) => {
  const { hasCopied, onCopy } = useClipboard(snippet.content);
  const { showSuccessToast, showErrorToast } = useToaster();
  const session = useSession();
  const isLoggedIn = session.status === 'authenticated';
  const [liked, setLiked] = useBoolean(snippet.likedByCurrentUser);

  // eslint-disable-next-line no-underscore-dangle
  const [likes, setLikes] = useState(snippet._count.likes);

  const handleFork = () => {
    forkSnippet(snippet, () => showSuccessToast(`Snippet forked`));
  };

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

  const debouncedLike = useCallback(
    debounce(() => handleLike(), 500),
    []
  );

  return (
    <>
      <SnipIconButton
        label={`${liked ? 'Dislike' : 'Like'} snippet`}
        icon={
          <HStack px={5}>
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
      {!snippet.isSnippetOwner ? (
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
        label="Copy snippet"
        icon={hasCopied ? <IoMdDoneAll /> : <FaClone />}
        onClick={onCopy}
      />
    </>
  );
};
