import { Container } from '@chakra-ui/react';
import type { ContainerProps } from '@chakra-ui/react';

import { Nav } from '~/components/nav';

type Props = {
  containerProps?: ContainerProps;
};

export const AppLayout: React.FC<Props> = ({ children, containerProps }) => {
  return (
    <>
      <Nav />
      <Container maxW="container.xl" {...containerProps}>
        {children}
      </Container>
    </>
  );
};
