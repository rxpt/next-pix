import NextAuth from "next-auth";
import Twitch from "next-auth/providers/twitch";

export const authOptions = {
  providers: [
    Twitch({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
  checks: "both",
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
