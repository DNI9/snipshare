import { SyntheticEvent, useRef, useState } from 'react';

import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  Spacer,
  useBoolean,
  useEventListener,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BiSearch } from 'react-icons/bi';

import { getQueryString } from '~/utils/next';

export const Search = () => {
  const router = useRouter();
  const [search, setSearch] = useState(getQueryString(router.query.q) || '');
  const [isFocused, inputFocus] = useBoolean(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEventListener('keydown', event => {
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator?.platform);
    const hotkey = isMac ? 'metaKey' : 'ctrlKey';
    const key = event?.key?.toLowerCase();

    if (isFocused && key === 'escape') inputRef.current?.blur();

    if (key === 'k' && event[hotkey]) {
      event.preventDefault();
      if (!isFocused && inputRef.current) inputRef.current.focus();
      else inputRef.current?.blur();
    }
  });

  const handleSearch = (e: SyntheticEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/explore?q=${search.trim()}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <InputGroup variant="outline" size="sm">
        <InputLeftElement pointerEvents="none">
          <BiSearch />
        </InputLeftElement>
        <Input
          onFocus={inputFocus.toggle}
          onBlur={inputFocus.toggle}
          ref={inputRef}
          pl={6}
          minW="sm"
          _focus={{ minW: 'md' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          rounded="md"
          name="search"
          type="search"
          placeholder="Search snippets, collections"
        />
        <InputRightElement mr={5}>
          <Kbd rounded="sm">CTRL</Kbd>
          <Spacer mx={0.5} />
          <Kbd rounded="sm">K</Kbd>
        </InputRightElement>
      </InputGroup>
    </form>
  );
};
