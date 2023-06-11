import { api } from "@/utils/api";
import Question from "./Question";

export default function TableQuestions() {
  const {
    data: categories,
    isLoading,
    isError,
  } = api.category.getAllWithQuestions.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {categories && categories.length ? (
        categories?.map((c) => {
          return (
            <div key={c.id}>
              <div className="whitespace-nowrap bg-gray-50 px-6 py-4 font-medium text-gray-900 dark:bg-gray-900 dark:text-gray-400">
                <p className="text-xl">{c.name}</p>
              </div>

              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Descrição
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Menu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {c.questions.map((q) => {
                    return <Question key={`${c.id}-${q.id}`} question={q} />;
                  })}
                </tbody>
              </table>
            </div>
          );
        })
      ) : (
        <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
          <th
            colSpan={3}
            scope="row"
            className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
          >
            Nenhuma pergunta encontrada
          </th>
        </tr>
      )}
    </div>
  );
}
