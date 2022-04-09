import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';

import { appTheme } from '~/lib/theme';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <SessionProvider session={pageProps.session}>
    <ChakraProvider theme={appTheme}>
      <NextNProgress options={{ showSpinner: false }} />
      <Component {...pageProps} />
    </ChakraProvider>
  </SessionProvider>
);

export default MyApp;
