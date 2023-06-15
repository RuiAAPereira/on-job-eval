import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import EmployeeEvaluations from "@/components/employees/EmployeeEvaluations";

export default function EmployeeDetails() {
  const { data: sessionData } = useSession();

  const { query } = useRouter();

  const { data: employee, error } = api.employee.getById.useQuery(
    String(query.id)
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Head>
        <title>Detalhes</title>
        <meta name="description" content="On job evaluation" />
        <link rel="icon" href="public/favicon.ico" />
      </Head>

      <main className="h-full">
        <div className="bg-gray-600 px-8 py-4">
          <h1 className="text-3xl font-bold text-white">
            Detalhes de {employee?.name}
          </h1>
          <p>
            {sessionData && (
              <span className="text-white">{sessionData.user.email}</span>
            )}
          </p>
        </div>

        {employee && (
          <div className="h-full p-12">
            <div className="mx-auto max-w-4xl rounded-md bg-gray-300 px-4 py-8 md:bg-gray-800 lg:py-16">
              <div className="flex w-full flex-wrap gap-x-6 gap-y-8">
                <div className="grow">
                  <div className="flex flex-wrap items-baseline justify-between">
                    <label className="block text-sm font-medium leading-6 text-gray-400">
                      Nome
                    </label>
                  </div>
                  <p className="input">{employee?.name}</p>
                </div>
                <div className="grow">
                  <div className="flex flex-wrap items-baseline justify-between">
                    <label className="block text-sm font-medium leading-6 text-gray-400">
                      Número
                    </label>
                  </div>
                  <p className="input">
                    {employee?.number ? employee.number : 0}
                  </p>
                </div>
                <div className="grow-1 flex flex-col">
                  <a
                    href={`/evaluation/${employee.id}`}
                    className="btn btn-green mt-auto"
                  >
                    Criar avaliação
                  </a>
                </div>
              </div>
              <div>
                <EmployeeEvaluations employeeId={employee.id} />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
