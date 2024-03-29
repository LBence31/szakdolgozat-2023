import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import type { GetServerSidePropsContext, NextPage } from "next";
import Sidebar from "~/components/Sidebar";
import Center from "~/components/Center";
import Recommend from "~/components/Recommend";
import Player from "~/components/Player";
import { premiumUserState } from "~/atoms/premiumAtom";
import { useRecoilState } from "recoil";

const Home: NextPage = () => {
  const [isPremium] = useRecoilState(premiumUserState);

  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Yfitops</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="flex">
        <Sidebar />
        <Center />
        <Recommend />
      </main>

      <div className="sticky bottom-0">{isPremium && <Player />}</div>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/login" } };
  }

  return {
    props: { session },
  };
}
