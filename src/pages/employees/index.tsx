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
      <main>
        <div>
          <h1>Formandos</h1>
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
          <div>
            <AddEmployee />
          </div>
          <div>
            <EmployeeTable />
          </div>
        </div>
      </main>
    </>
  );
}
