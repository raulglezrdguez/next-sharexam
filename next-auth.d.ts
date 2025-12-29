import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: number;
    status?: number;
  }
  interface Session {
    user: {
      role?: number;
      status?: number;
    } & DefaultSession["user"];
  }
}
