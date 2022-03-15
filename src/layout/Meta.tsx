import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AppConfig } from '~/utils/AppConfig';

type IMetaProps = {
  title: string;
  description?: string;
  canonical?: string;
};

export const Meta = (props: IMetaProps) => {
  const router = useRouter();
  const { basePath } = router;
  const { title } = props;
  const description = props?.description || AppConfig.description;
  const url = props?.canonical || AppConfig.site_url + router.asPath;

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link
          rel="apple-touch-icon"
          href={`${basePath}/apple-touch-icon.png`}
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/favicon-32x32.png`}
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/favicon-16x16.png`}
          key="icon16"
        />
        <link rel="icon" href={`${basePath}/favicon.ico`} key="favicon" />
      </Head>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title,
          description,
          url,
          locale: AppConfig.locale,
          site_name: AppConfig.site_name,
          // TODO: add image url
          images: [{ url: '' }],
        }}
      />
    </>
  );
};
