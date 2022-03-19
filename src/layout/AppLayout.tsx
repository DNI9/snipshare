import { Container } from '@chakra-ui/react';

import { Nav } from '~/components/nav';

export const AppLayout: React.FC = ({ children }) => {
  return (
    <>
      <Nav />
      <Container maxW="container.xl">{children}</Container>
    </>
  );
};
