/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";

export default function Login({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <Image
        src="/logo.png"
        width={2000}
        height={2000}
        alt="logo"
        className="mb-5 w-52"
      />

      {Object.values(providers!).map((provider) => (
        <div key={provider.name}>
          <button
            className="rounded-full bg-[#18D860] p-5 text-white"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Log in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers },
  };
}
