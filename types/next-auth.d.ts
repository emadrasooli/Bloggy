import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {

  interface User extends DefaultUser {
    id: string;
    role?: string;
    name?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
  }
}
