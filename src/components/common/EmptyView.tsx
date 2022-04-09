import { Heading, VStack, Text, Center } from '@chakra-ui/react';

import { AppLayout, Meta } from '~/layout';

type Props = {
  message?: string;
  description?: string;
};

export const EmptyView: React.FC<Props> = ({
  children,
  message,
  description,
}) => {
  return (
    <>
      <Meta title="SnipShare" />
      <AppLayout>
        <Center minH={'85vh'}>
          <VStack textAlign="center">
            <Heading
              lineHeight="normal"
              display="inline-block"
              as="h1"
              fontSize={['5xl', '6xl', '8xl']}
              size="4xl"
              bgGradient="linear(to-r, blue.400, purple.300)"
              backgroundClip="text"
            >
              {message || 'Such Empty'}
            </Heading>
            {description && (
              <Text color={'gray.500'} mb={6}>
                {description}
              </Text>
            )}
            {children}
          </VStack>
        </Center>
      </AppLayout>
    </>
  );
};
