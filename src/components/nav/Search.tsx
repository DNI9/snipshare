import { SyntheticEvent, useState } from 'react';

import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  Spacer,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BiSearch } from 'react-icons/bi';

export const Search = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();

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
