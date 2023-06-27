import Head from "next/head";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import FormEvaluation from "@/components/evaluation/FormEvaluation";
import { useRouter } from "next/router";
import Wrapper from "@/components/common/Wrapper";

export default function CreateEvaluation() {
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
        <title>Avaliação</title>
        <meta name="description" content="On job evaluation" />
        <link rel="icon" href="public/favicon.ico" />
      </Head>

      <Wrapper>
        <div className="relative mt-8 overflow-x-auto p-6 shadow-md sm:rounded-lg">
          {employee && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white p-8 shadow-xl">
                <h4 className="text-xl font-bold text-gray-900">
                  {employee?.name}
                </h4>
                <ul className="mt-2 text-gray-700">
                  <li className="flex border-y py-2">
                    <span className="w-24 font-bold">Número:</span>
                    <span className="text-gray-700">
                      {employee?.number ? employee.number : 0}
                    </span>
                  </li>
                </ul>
              </div>
              <FormEvaluation employeeId={employee.id} />
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
}
