import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

import SpotifyApi, { LOGIN_URL } from "~/lib/spotify";
import spotifyApi from "~/lib/spotify";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    error?: "RefreshAccessTokenError";
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      const spotify = await prisma.account.findFirst({
        where: {
          userId: user.id,
        },
      });
      if (
        spotify != null &&
        spotify != undefined &&
        spotify.expires_at != null &&
        spotify.access_token != null &&
        spotify.refresh_token != null
      ) {
        if (spotify.expires_at * 1000 < Date.now()) {
          //refresh
          try {
            SpotifyApi.setAccessToken(spotify.access_token);
            spotifyApi.setRefreshToken(spotify.refresh_token);
            const { body: refreshedToken } =
              await SpotifyApi.refreshAccessToken();
            await prisma.account.update({
              data: {
                access_token: refreshedToken.access_token,
                expires_at: Math.floor(
                  Date.now() / 1000 + refreshedToken.expires_in
                ),
                refresh_token:
                  refreshedToken.refresh_token ?? spotify.refresh_token,
              },
              where: {
                provider_providerAccountId: {
                  provider: "spotify",
                  providerAccountId: spotify.providerAccountId,
                },
              },
            });
          } catch (error) {
            console.error("Error refreshing access token", error);
            session.error = "RefreshAccessTokenError";
          }
        }
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_ID,
      clientSecret: env.SPOTIFY_SECRET,
      authorization: LOGIN_URL,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  secret: env.SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
