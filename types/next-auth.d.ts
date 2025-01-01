import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {

  interface User extends DefaultUser {
    role?: string;
    name?: string;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
  }
}
