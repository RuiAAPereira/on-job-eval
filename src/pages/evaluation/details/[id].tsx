import Head from "next/head";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

export default function Evaluation() {
  const { data: sessionData } = useSession();

  const { query } = useRouter();

  const { data: evaluation, error } = api.evaluation.getById.useQuery(
    String(query.id)
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const count = evaluation?.answers.length ?? 0;
  const sum = evaluation?.answers.reduce((a, b) => a + b.score, 0) ?? 0;
  const average = (sum / count).toFixed(2);

  return (
    <>
      <Head>
        <title>Avaliação</title>
        <meta name="description" content="On job evaluation" />
        <link rel="icon" href="public/favicon.ico" />
      </Head>

      <main>
        <div>
          <h1>Avaliação de {evaluation?.employee?.name}</h1>
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
            {evaluation && (
              <>
                <div>
                  <div>
                    <div>
                      <label>Nome</label>
                    </div>
                    <p>{evaluation.employee?.name}</p>
                  </div>
                  <div>
                    <div>
                      <label>Número</label>
                    </div>
                    <p>
                      {evaluation.employee?.number
                        ? evaluation.employee.number
                        : 0}
                    </p>
                  </div>
                </div>

                <h1>Média: {average}</h1>
                {evaluation.answers.map((answer) => (
                  <div>
                    <div>
                      <div>
                        <label>Pergunta</label>
                      </div>

                      <p>{answer.question.name}</p>
                    </div>
                    <div>
                      <div>
                        <label>Resposta</label>
                      </div>
                      <p>{answer.score}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
