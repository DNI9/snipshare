import { Grid, GridItem, SimpleGrid } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { ProfileSidebar } from '~/components/profile';
import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { prisma } from '~/lib/prisma';
import { getPublicSnippets } from '~/services/snippet';
import { SnippetData } from '~/types/snippet';
import { UserWithCounts } from '~/types/user';

type Props = {
  user: UserWithCounts;
  data: SnippetData;
};

export default function PublicProfile({ user, data }: Props) {
  return (
    <>
      <Meta title={`${user.name}'s Profile`} />
      <AppLayout>
        <Grid
          gap={5}
          my={3}
          gridTemplateColumns={{ sm: '1fr', lg: '1fr 2fr' }}
          mt={8}
        >
          <ProfileSidebar user={user} />
          <GridItem>
            <SimpleGrid columns={1} spacing={5}>
              {data.snippets.map(snippet => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </SimpleGrid>
          </GridItem>
        </Grid>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const username = String(params?.username).trim();
  const session = await getSession({ req });

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, name: true, image: true },
  });

  if (!user) return { notFound: true };
  if (session && user.id === session.user.id) {
    return {
      redirect: { destination: '/profile', permanent: false },
    };
  }

  const data = await getPublicSnippets({
    loggedInUser: session?.user.id,
    queryUserId: user?.id,
  });

  return {
    props: {
      user: {
        ...user,
        _count: { snippets: data.totalResults, collections: 0 }, // TODO: add collection count
      },
      data,
    },
  };
};
