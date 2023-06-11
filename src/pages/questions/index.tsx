import { api } from "@/utils/api";
import Head from "next/head";
import { useSession } from "next-auth/react";

export default function Questions() {
  const { data: sessionData } = useSession();
  const {
    data: categories,
    isLoading,
    isError,
  } = api.category.getAll.useQuery();

  const { data: groupedQuestions } = api.category.getAllGrouped.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <>
      <Head>
        <title>Questions</title>
        <meta name="description" content="Full stack todo app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col px-4 py-16 ">
          {sessionData && (
            <div className="grid grid-cols-1 gap-4 md:gap-8">
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
                <h3 className="text-xl font-bold">Perguntas</h3>

                <div>
                  {groupedQuestions?.length
                    ? groupedQuestions?.map((q) => {
                        return (
                          <div key={q.id}>
                            <h3 className="text-xl font-bold">{q.name}</h3>
                            <div className="grid grid-cols-1 gap-4 md:gap-8">
                              {q.questions?.map((question: any) => {
                                return (
                                  <div key={question.id} className=" pt-2 ">
                                    <h3 className="text-xl font-bold">
                                      {question.text}
                                    </h3>
                                    <p>{question.questionText}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </div>

                <div>
                  <label
                    htmlFor="categorias"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Selecionar Categoria
                  </label>

                  <select
                    id="categorias"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  >
                    {categories.length ? (
                      categories?.map((c) => {
                        return (
                          <option value={c.id} key={c.id}>
                            {c.name}
                          </option>
                        );
                      })
                    ) : (
                      <option value="a"></option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
