import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function spotifyErrorCheck() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      void signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);
}
