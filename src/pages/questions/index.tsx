import { api } from "@/utils/api";
import Head from "next/head";
import { useSession } from "next-auth/react";
import AddQuestion from "@/components/questions/AddQuestion";
import TableQuestions from "@/components/questions/TableQuestions";

export default function Questions() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Perguntas</title>
        <meta name="description" content="On job evaluation" />
        <link rel="icon" href="public/favicon.ico" />
      </Head>
      <main className="h-full">
        <div className="bg-gray-600 px-8 py-4">
          <h1 className="text-3xl font-bold text-white">Perguntas</h1>
          <p>
            {sessionData && (
              <span>
                {sessionData.user?.name} - logado como{" "}
                {sessionData.user?.role.toLowerCase()}
              </span>
            )}
          </p>
        </div>
        <div className="flex h-full flex-wrap gap-12 p-12">
          <div className="max-w-md flex-auto">
            <AddQuestion />
          </div>
          <div className="grow">
            <TableQuestions />
          </div>
        </div>
      </main>
    </>
  );
}
