/* eslint-disable @typescript-eslint/no-unsafe-argument */
import SpotifyWebApi from "spotify-web-api-node";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { env } from "~/env.mjs";

const spotifyApi = new SpotifyWebApi({
  clientId: env.NEXT_PUBLIC_SPOTIFY_ID,
  clientSecret: env.NEXT_PUBLIC_SPOTIFY_SECRET,
});

export default function useSpotify() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session.error === "RefreshAccessTokenError") {
        void signIn();
      }

      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyApi;
}
