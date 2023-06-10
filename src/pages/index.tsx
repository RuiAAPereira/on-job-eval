import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "@/utils/api";


const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Avaliação On Job Training</title>
        <meta name="description" content="Avaliação On Job Training" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      
      </main>
    </>
  );
};

export default Home;