import NextAuth from "next-auth";
import Twitch from "next-auth/providers/twitch";

export const authOptions = {
  providers: [
    Twitch({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};

export default NextAuth(authOptions);
