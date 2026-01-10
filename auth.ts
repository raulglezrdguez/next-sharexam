import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import clientPromise from "./lib/mongoDBClient";
import { User } from "./lib/models";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      id: "google-mobile",
      name: "Google Mobile",
      // credentials: {
      //   idToken: { label: "ID Token", type: "text" }, isGoogleLogin: { label: "Is Google Login", type: "text" }
      // },
      async authorize(credentials) {
        const creds = credentials as Record<string, string>;

        if (credentials.isGoogleLogin === "true") {
          const user = await User.findOne({ email: creds.email });

          if (!user) {
            const result = await User.insertOne({
              name: creds.name,
              email: creds.email,
              image: creds.image,
              locale: creds.locale,
              role: 1,
              status: 1,
            });
            return {
              id: result.insertedId.toString(),
              name: creds.name,
              email: creds.email,
              image: creds.image,
              locale: creds.locale,
              role: 1,
              status: 1,
            };
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            locale: user.locale,
            role: user.role,
            status: user.status,
          };
        }

        if (!credentials?.idToken) return null;

        const res = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${credentials.idToken}`
        );
        const googleUser = await res.json();

        if (!res.ok || !googleUser.email) return null;

        // 2. Find or create the user in your MongoDB
        // const user = await findOrCreateUser(googleUser);

        return {
          id: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
        };
      },
    }),
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
        token.id = user.id || "";
        token.role = user.role || 1;
        token.status = user.status || 1;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as number;
        session.user.status = token.status as number;
      }
      return session;
    },
  },
});
