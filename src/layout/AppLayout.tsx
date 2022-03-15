import { Container } from '@chakra-ui/react';

export const AppLayout: React.FC = ({ children }) => {
  return (
    <>
      <Container maxW="container.xl">{children}</Container>
    </>
  );
};
