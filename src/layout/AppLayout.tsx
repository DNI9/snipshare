import { Container } from '@chakra-ui/react';
import { DefaultSession } from 'next-auth';

import { Nav } from '~/components/nav';

type Props = {
  user: DefaultSession['user'];
};

export const AppLayout: React.FC<Props> = ({ children, user }) => {
  return (
    <>
      <Nav user={user} />
      <Container maxW="container.xl">{children}</Container>
    </>
  );
};
