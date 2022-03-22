import {
  Avatar,
  Center,
  GridItem,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

import { UserWithCounts } from '~/types/user';

type Props = {
  user: UserWithCounts;
};

export const ProfileSidebar: React.FC<Props> = ({ user }) => {
  return (
    <GridItem>
      <Center p={3} border="1px" borderColor="gray.200" borderRadius={5}>
        <VStack>
          <Avatar size="xl" name={user.name || 'Anon'} src={user.image!} />
          <Heading>{user.name}</Heading>
          <Text>
            {/* eslint-disable-next-line no-underscore-dangle */}
            {user?._count.snippets} snippet - {user?._count.collections}{' '}
            Collections
          </Text>
        </VStack>
      </Center>
    </GridItem>
  );
};
