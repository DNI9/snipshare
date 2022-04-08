import { useCallback, useState } from 'react';

import {
  Badge,
  HStack,
  Show,
  useBoolean,
  useClipboard,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { BiGitRepoForked } from 'react-icons/bi';
import { FaClone, FaHeart } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { IoMdDoneAll } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';

import { CoreMenu } from '~/components/menu';
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
      <Show breakpoint="(max-width: 30em)">
        <CoreMenu
          items={[
            { title: 'Copy', onClick: onCopy, icon: <FaClone /> },
            {
              title: 'Edit',
              hidden: !isLoggedIn || !snippet.isSnippetOwner,
              onClick: () => Router.push(`/update/${snippet.id}`),
              icon: <MdEdit />,
            },
            {
              title: 'Fork',
              hidden: !isLoggedIn || snippet.isSnippetOwner,
              onClick: handleFork,
              icon: <BiGitRepoForked />,
            },
          ]}
        >
          <SnipIconButton label="Snippet Menu" icon={<HiDotsVertical />} />
        </CoreMenu>
      </Show>
      <Show breakpoint="(min-width: 30em)">
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
      </Show>
    </>
  );
};
