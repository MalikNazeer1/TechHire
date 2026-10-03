import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      checks: ["none"],
      httpOptions: {
        timeout: 10000, // Increase timeout to 10 seconds
      },
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/calendar.events openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!profile?.email) {
          return false;
        }
        await prisma.user.upsert({
          where: {
            email: profile.email,
          },
          update: {
            name: profile.name,
            avatar: profile.picture,
            lastSignIn: new Date(),
          },
          create: {
            id: profile.sub,
            email: profile.email,
            name: profile.name,
            avatar: profile.picture,
            lastSignIn: new Date(),
          },
        });
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.avatar = user.avatar;
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Add user id and other custom fields to the session
        session.user.id = token.id;
        session.user.avatar = token.avatar;
        session.user.email = token.email;
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
