import Head from "next/head";
import { useSession } from "next-auth/react";
import AddQuestion from "@/components/questions/AddQuestion";
import TableQuestions from "@/components/questions/TableQuestions";
import Wrapper from "@/components/common/Wrapper";

export default function Questions() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Perguntas</title>
        <meta name="description" content="On job evaluation" />
        <link rel="icon" href="public/favicon.ico" />
      </Head>
      <Wrapper>
        <div>
          <h1>Perguntas</h1>
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
            {/* <AddQuestion /> */}
          </div>
          <div>
            {/* <TableQuestions /> */}
          </div>
        </div>
      </Wrapper>
    </>
  );
}
