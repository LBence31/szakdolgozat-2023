import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      void signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Yfitops</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <h2 className="mt-5">
            {session ? (
              <button onClick={() => void signOut()}>Log Out</button>
            ) : (
              <button onClick={() => void signIn()}>Log In</button>
            )}
          </h2>
        </div>
      </main>
    </>
  );
};

export default Home;
