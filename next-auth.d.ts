import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: number;
    status?: number;
    locale?: string;
  }
  interface Session {
    user: {
      id: string;
      role?: number;
      status?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: number;
    status: number;
  }
}
