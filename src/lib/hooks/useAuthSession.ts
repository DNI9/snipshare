import { useSession } from 'next-auth/react';
import { Object } from 'ts-toolbelt';

type AuthSession = Object.Merge<
  ReturnType<typeof useSession>,
  {
    isLoggedIn: boolean;
    isLoading: boolean;
  }
>;

export const useAuthSession = (): AuthSession => {
  const session = useSession();
  const isLoggedIn = session.status === 'authenticated';
  const isLoading = session.status === 'loading';

  return { ...session, isLoggedIn, isLoading };
};
