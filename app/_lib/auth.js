import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { createGuest, getGuest } from './data-service';

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    authorized({ auth, request }) {
      // return !!auth?.user; //short-hand for the below
      // console.log(request);
      return auth?.user ? true : false;
    },

    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });
        return true;
      } catch {
        return false;
      }
    },

    async session({ session, user }) {
      console.log(session);
      const guest = await getGuest(session.user.email);

      session.user.id = guest.id; //Add the newly created guestId to our session.user object

      return session; //Always return session to avoid "no more session" error
    },
  },

  pages: {
    signIn: '/login',
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);

// console.log(auth);
