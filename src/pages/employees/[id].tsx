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

      <main>
        <div>
          <h1>Detalhes de {employee?.name}</h1>
          <p>{sessionData && <span>{sessionData.user.email}</span>}</p>
        </div>

        {employee && (
          <div>
            <div className="mx-auto max-w-4xl rounded-md bg-gray-300 px-4 py-8 md:bg-gray-800 lg:py-16">
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
                <div>
                  <a href={`/evaluation/${employee.id}`}>Criar avaliação</a>
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
