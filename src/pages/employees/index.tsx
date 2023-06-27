import Head from "next/head";
import TableEmployees from "@/components/employees/TableEmployees";
import Wrapper from "@/components/common/Wrapper";


export default function Employees() {
 

  return (
    <>
      <Head>
        <title>Formandos</title>
        <meta name="description" content="On job evaluation" />
        <link rel="shortcut icon" href="public/favicon.ico" />
      </Head>
      <Wrapper>
        <div>
          <h1 className="text-xl ">Formandos</h1>

          <TableEmployees />
        </div>
      </Wrapper>
    </>
  );
}
