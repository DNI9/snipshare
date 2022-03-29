import { Grid, GridItem, SimpleGrid, Spacer } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { CollectionCard, TitleRow } from '~/components/dashboard';
import { ProfileSidebar } from '~/components/profile';
import { SnippetCard } from '~/components/snippet';
import { AppLayout, Meta } from '~/layout';
import { getSnippets } from '~/services/snippet';
import { getUserById } from '~/services/user';
import { SnippetData } from '~/types/snippet';
import { UserWithCounts } from '~/types/user';
import { redirect } from '~/utils/next';

type Props = {
  user: UserWithCounts;
  data: SnippetData;
};

export default function Profile({ user, data }: Props) {
  return (
    <>
      <Meta title="Profile" />
      <AppLayout>
        <Grid gap={5} gridTemplateColumns={{ sm: '1fr', lg: '1fr 2fr' }} mt={8}>
          <ProfileSidebar user={user} />
          <GridItem>
            <TitleRow href="/collections" title="Collections" />
            <SimpleGrid mt={3} columns={{ sm: 2 }} spacing={5}>
              <CollectionCard />
              <CollectionCard />
            </SimpleGrid>
            <Spacer my={5} />
            <TitleRow href="#" title="Snippets" />
            <SimpleGrid my={3} columns={1} spacing={5}>
              {data.snippets.map(snippet => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  isSnippetOwner
                />
              ))}
            </SimpleGrid>
          </GridItem>
        </Grid>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) return redirect('/auth/signin');

  const user = await getUserById(session.user.id);
  const data = await getSnippets(session.user.id);

  return {
    props: { user, data },
  };
};
