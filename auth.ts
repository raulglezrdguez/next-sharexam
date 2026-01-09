import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import clientPromise from "./lib/mongoDBClient";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          locale: profile.locale,
          role: 1,
          status: 1,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // user viene de mongodb
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, user }) {
      // user viene de mongodb
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.status = user.status;
      }
      return session;
    },
  },
});
