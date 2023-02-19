import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { getCsrfToken } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import MessageForm from "@/components/messageForm";
import { Exo } from "@next/font/google";
const exoFont = Exo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-exo",
});

export default function Home(props) {
  const { user, isAuthenticated } = props;
  return (
    <>
      <Head>
        <title>Mande uma mensagem - Xog.one</title>
      </Head>
      <div
        className={`${exoFont.className} font-sans w-full h-screen flex justify-center bg-zinc-800 text-white`}
      >
        <div className="columns-sm my-20">
          <div className="w-full max-w-full rounded-lg shadow border border-zinc-700 bg-zinc-900">
            <div className="p-10">
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-400">
                  Olá, {isAuthenticated ? user.name : "visitante"}!
                </span>
                <h1 className="mb-1 text-xl font-medium text-white">
                  Envie uma mensagem
                </h1>
              </div>
              <div className="mt-4">
                <MessageForm {...props} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const csrfToken = await getCsrfToken({ req });
  const session = await getServerSession(req, res, authOptions);
  return {
    props: {
      user: session?.user ?? {},
      isAuthenticated: !!session?.user,
      csrfToken,
    },
  };
}
