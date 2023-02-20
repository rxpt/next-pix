import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { getCsrfToken, signIn, signOut } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { FaSignOutAlt, FaSignInAlt, FaCookie } from "react-icons/fa";
import MessageForm from "@/components/messageForm";
import { Exo } from "@next/font/google";
const exoFont = Exo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-exo",
});
import Tooltip from "@/components/tooltip";
import Modal from "@/components/modal";
import TermosUso from "@/components/termosUso";

export default function Home(props) {
  const { user, isAuthenticated } = props;
  return (
    <>
      <Head>
        <title>Mande uma mensagem - Xog.one</title>
      </Head>
      <div
        className={`${exoFont.className} font-sans w-full h-full min-h-screen flex justify-center bg-zinc-800 text-white`}
      >
        <div className="w-96 max-w-full my-10">
          <div className="w-full max-w-full rounded-lg shadow border border-zinc-700 bg-zinc-900">
            <div className="p-10">
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  Olá,{" "}
                  {isAuthenticated ? (
                    <>
                      {user.name}!{" "}
                      <Tooltip message="Sair" position="left">
                        <button
                          className="signOut"
                          onClick={() => signOut()}
                          type={"button"}
                        >
                          <FaSignOutAlt />
                        </button>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      visitante!{" "}
                      <Tooltip message="Entrar" position="left">
                        <button
                          className="signIn"
                          onClick={() => signIn("twitch")}
                          type={"button"}
                        >
                          <FaSignInAlt />
                        </button>
                      </Tooltip>
                    </>
                  )}
                </span>
                <h1 className="mb-1 text-xl font-medium text-white">
                  Mande uma mensagem
                </h1>
              </div>
              <div className="mt-4">
                <MessageForm {...props} />
              </div>
            </div>
          </div>{" "}
          <div className="flex justify-center items-center">
            <Modal
              classButton="text-zinc-500 text-sm float-right flex items-center gap-1 mt-3"
              textButton={<>Termos de Uso</>}
            >
              <TermosUso />
            </Modal>
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
