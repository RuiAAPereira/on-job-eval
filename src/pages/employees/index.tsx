import Head from "next/head";
import { useSession } from "next-auth/react";
import AddEmployee from "@/components/employees/AddEmployee";
import EmployeeTable from "@/components/employees/TableEmployees";

export default function Employees() {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Formandos</title>
        <meta name="description" content="On job evaluation" />
        <link rel="shortcut icon" href="public/favicon.ico" />
      </Head>
      <main className="h-full">
        <div className="bg-gray-600 px-8 py-4">
          <h1 className="text-3xl font-bold text-white">Formandos</h1>
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
            <AddEmployee />
          </div>
          <div className="grow">
            <EmployeeTable />
          </div>
        </div>
      </main>
    </>
  );
}
