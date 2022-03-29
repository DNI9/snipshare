import type { Redirect } from 'next';

export const redirect = (destination: string = '/'): { redirect: Redirect } => {
  return {
    redirect: { destination, permanent: false },
  };
};
