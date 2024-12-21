import NextAuth, { User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { saltAndHashPassword } from "./utils/helper";

const prisma = new PrismaClient();

//this is to add role to the session type
declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & NextAuthUser;
  }
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const email = credentials.email as string;
        const hash = saltAndHashPassword(credentials.password);

        let user: any = await db.user.findUnique({
          where: { email: email },
        });

        const isMatch = bcrypt.compareSync(
          credentials.password as string,
          user.hashedPassword
        );
        if (!isMatch) {
          throw new Error("Password is incorrect");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    //add role to the session
    async session({ session, token }) {
      //console.log("Token------------------------------>:", token);
      // Connect to the database
      const user = await db.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) {
        session.user.role = user.role ?? "defaultRole";
      }
      return session;
    },
  },
});
