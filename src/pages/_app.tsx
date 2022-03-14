import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <SessionProvider session={pageProps.session}>
    <Component {...pageProps} />
  </SessionProvider>
);

export default MyApp;
