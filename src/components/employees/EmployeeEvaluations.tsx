import { api } from "@/utils/api";
import router from "next/router";

type props = {
  employeeId: string;
};

export default function EmployeeEvaluations({ employeeId }: props) {
  const {
    data: evaluations,
    isLoading,
    isError,
  } = api.evaluation.getByEmployeeId.useQuery(employeeId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <>
      {evaluations?.evaluations.length ? (
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <h4 className="flex items-center justify-between text-xl font-bold text-gray-900">
            <span>Avaliação</span>
            <span
              className={`rounded-full px-3 py-1 text-white ${
                evaluations.averageScore < 2.5 ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {Math.round(evaluations.averageScore)}
            </span>
          </h4>
          <ul className="mt-2 text-gray-700">
            {evaluations.evaluations.map(
              (evaluation: {
                id: string;
                answers: { score: number; question: { name: string } }[];
              }) => {
                return evaluation.answers.map(
                  (answer: { score: number; question: { name: string } }) => {
                    return (
                      <li
                        className="flex items-center justify-between gap-8 border-y py-4"
                        key={answer.question.name}
                      >
                        <span className="font-bold">
                          {answer.question.name}
                        </span>
                        <span className="text-gray-700">{answer.score}</span>
                      </li>
                    );
                  }
                );
              }
            )}
          </ul>
        </div>
      ) : (
        <div className="flex-1 rounded-lg bg-white p-8 shadow-xl">
          <h4 className="text-xl font-bold text-gray-900">Avaliação</h4>
          <p>Este formando ainda não tem avaliações</p>
          <button
            className="mt-4 inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
            type="button"
            onClick={() => router.push(`/evaluation/${employeeId}/create`)}
          >
            Criar avaliação
          </button>
        </div>
      )}
    </>
  );
}
