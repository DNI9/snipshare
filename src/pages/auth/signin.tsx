import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
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
  const [isLargerThan30em] = useMediaQuery('(min-width: 30em)');

  return (
    <>
      {providers.map(provider => (
        <Button
          leftIcon={<AiOutlineGithub size={isLargerThan30em ? 25 : 22} />}
          colorScheme="blue"
          key={provider.id}
          size={isLargerThan30em ? 'md' : 'sm'}
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
      <Center minH="100vh" flexDirection="column">
        <Text fontSize={['md', '2xl', '3xl']}>Create, Share and explore</Text>
        <Heading
          bgGradient="linear(to-r, blue.400, purple.300)"
          bgClip="text"
          fontSize={['5xl', '6xl', '8xl']}
          fontWeight="extrabold"
          as="h1"
          size="4xl"
        >
          Code Snippets
        </Heading>
        <Box mt={{ base: 5, sm: 25 }}>
          <Providers providers={providers} />
        </Box>
      </Center>
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
