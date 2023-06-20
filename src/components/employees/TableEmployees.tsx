import { api } from "@/utils/api";
import Employee from "./Employee";

export default function TableEmployees() {
  const {
    data: employees,
    isLoading,
    isError,
  } = api.employee.getAll.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Descrição</th>
            <th scope="col">Menu</th>
          </tr>
        </thead>
        <tbody>
          {employees.length ? (
            employees?.map((c) => {
              return <Employee key={c.id} employee={c} />;
            })
          ) : (
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <th
                colSpan={3}
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                Nenhum formando encontrado
              </th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
