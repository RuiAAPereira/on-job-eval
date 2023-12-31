import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import EmployeeEvaluations from "@/components/employees/EmployeeEvaluations";
import PageHead from "@/components/layout/head";

export default function EditEmployee() {
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
      <PageHead title={"Editar Formando"} />

      <main>
        <div>
          <h1>Detalhes de {employee?.name}</h1>
          <p>{sessionData && <span>{sessionData.user.email}</span>}</p>
        </div>

        {employee && (
          <div>
            <div className="">
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
