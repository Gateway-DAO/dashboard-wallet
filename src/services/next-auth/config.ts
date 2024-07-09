import { NextAuthOptions } from 'next-auth';

import routes from '@/constants/routes';
import { LoginSessionV3, SessionV3 } from '@/types/user';

import getMe from './libs/get-me';
import credentialJwt from './providers/credential-jwt';

export const nextAuthConfig: NextAuthOptions = {
  providers: [credentialJwt],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async jwt({ token, user }) {
      // We're retrieving the token from the provider
      if (user) {
        token = user as LoginSessionV3;
      }

      return token;
    },
    async session({ session, token }) {
      try {
        const { me: user, ...protocolV3Data } = await getMe(token.token);
        return {
          ...session,
          ...token,
          ...protocolV3Data,
          user,
        } satisfies SessionV3 as any;
      } catch (e) {
        console.error('Error on get session', e);
        throw e;
      }
    },
  },
  pages: {
    signIn: routes.login,
  },
};
