import Head from "next/head";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

export default function Evaluation() {
  const { data: sessionData } = useSession();

  const { query } = useRouter();

  const { data: evaluation, error } = api.evaluation.getById.useQuery(
    String(query.id)
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Head>
        <title>Avaliação</title>
        <meta name="description" content="On job evaluation" />
        <link rel="icon" href="public/favicon.ico" />
      </Head>

      <main className="h-full">
        <div className="bg-gray-600 px-8 py-4">
          <h1 className="text-3xl font-bold text-white">
            Avaliação de {evaluation?.employee?.name}
          </h1>
          <p>
            {sessionData && (
              <span>
                {sessionData.user?.name} - logado como{" "}
                {sessionData.user?.role.toLowerCase()}
              </span>
            )}
          </p>
        </div>

        <div className="h-full p-12">
          <div className="mx-auto max-w-4xl rounded-md bg-gray-300 px-4 py-8 md:bg-gray-800 lg:py-16">
            {evaluation && (
              <>
                <div className="flex w-full flex-wrap gap-x-6 gap-y-8">
                  <div className="grow">
                    <div className="flex flex-wrap items-baseline justify-between">
                      <label className="block text-sm font-medium leading-6 text-gray-400">
                        Nome
                      </label>
                    </div>
                    <p className="input">{evaluation.employee?.name}</p>
                  </div>
                  <div className="grow">
                    <div className="flex flex-wrap items-baseline justify-between">
                      <label className="block text-sm font-medium leading-6 text-gray-400">
                        Número
                      </label>
                    </div>
                    <p className="input">
                      {evaluation.employee?.number
                        ? evaluation.employee.number
                        : 0}
                    </p>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
