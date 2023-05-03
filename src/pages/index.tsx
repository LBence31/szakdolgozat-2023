import { signIn, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import type { GetServerSidePropsContext, NextPage } from "next";
import Sidebar from "./components/Sidebar";

interface Props {
  state: string;
}

const Home: NextPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      void signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Yfitops</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <Sidebar />
      </main>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/signin" } };
  }

  return {
    props: { state: "ok" },
  };
}
