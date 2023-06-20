import Head from "next/head";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import FormEvaluation from "@/components/evaluation/FormEvaluation";
import { useRouter } from "next/router";

export default function Evaluation() {
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

      <main>
        <div>
          <h1>Avaliação de {employee?.name}</h1>
          <p>
            {sessionData && (
              <span>
                {sessionData.user?.name} - logado como{" "}
                {sessionData.user?.role.toLowerCase()}
              </span>
            )}
          </p>
        </div>

        <div>
          <div className="mx-auto max-w-4xl rounded-md bg-gray-300 px-4 py-8 md:bg-gray-800 lg:py-16">
            {employee && (
              <>
                <div>
                  <div>
                    <div>
                      <label>Nome</label>
                    </div>
                    <p>{employee?.name}</p>
                  </div>
                  <div>
                    <div>
                      <label>Número</label>
                    </div>
                    <p>{employee?.number ? employee.number : 0}</p>
                  </div>
                </div>
                <FormEvaluation employeeId={employee.id} />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
