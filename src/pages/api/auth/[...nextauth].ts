import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

import { prisma } from '~/lib/prisma';

const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          username: profile.login,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      // eslint-disable-next-line no-param-reassign
      session.user.id = user.id;
      return session;
    },
  },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
