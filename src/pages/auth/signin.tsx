import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  signIn,
} from 'next-auth/react';
import { AiOutlineGithub } from 'react-icons/ai';

import { Meta } from '~/layout';

type Props = {
  providers: ClientSafeProvider[];
};

const Providers = ({ providers }: Props) => {
  return (
    <>
      {providers.map(provider => (
        <Button
          leftIcon={<AiOutlineGithub size={25} />}
          colorScheme="blue"
          key={provider.id}
          onClick={() => signIn(provider.id)}
        >
          Continue with {provider.name}
        </Button>
      ))}
    </>
  );
};

export default function SignIn({ providers }: Props) {
  return (
    <>
      <Meta title="Login to Snipshare" />
      <Container maxW="container.xl" minH="100vh">
        <Flex
          align="center"
          justify="center"
          minH={'100vh'}
          flexDirection="column"
        >
          <Text fontSize="2xl">Create, Share and explore</Text>
          <Heading
            bgGradient="linear(to-r, blue.400, purple.300)"
            bgClip="text"
            fontSize="8xl"
            fontWeight="extrabold"
            as="h1"
            size="4xl"
          >
            Code Snippets
          </Heading>
          <Box mt={25}>
            <Providers providers={providers} />
          </Box>
        </Flex>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: { destination: '/', permanent: false },
    };
  }

  const authProviders = await getProviders();
  const providers = Object.values(authProviders!);

  return {
    props: { providers },
  };
};
