import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";

import { signOut } from "next-auth/react";

const Home: NextPage = () => {
  //const result = api.greeting.greeting.useQuery({ name: "client" });

  const { data: session } = useSession();
  console.log(session);

  return (
    <>
      <Head>
        <title>Yfitops</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <h2 className="mt-5">
            <button onClick={() => void signOut()}>Log Out</button>
          </h2>
        </div>
      </main>
    </>
  );
};

export default Home;
