import { useState } from "react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { questionName, questionDescription } from "@/types";

export default function AddQuestion() {
  const trpc = api.useContext();

  const { data: categories } = api.category.getAll.useQuery();

  const [newQuestionName, setNewQuestionName] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    categories?.[0]?.id ?? ""
  );

  const { mutate } = api.question.create.useMutation({
    onError: (
      err,
      { name: newQuestionName },
      ctx: { previousQuestions?: any[] } = {}
    ) => {
      toast.error("Falha ao criar pergunta");
      setNewQuestionName(newQuestionName);
      trpc.category.getAllWithQuestions.setData(
        undefined,
        () => ctx?.previousQuestions
      );
    },
    onSettled: async () => {
      await trpc.category.getAllWithQuestions.invalidate();
    },
    onSuccess: () => {
      toast.success("Pergunta criada com sucesso!");
    },
    onMutate: async ({
      name: newQuestionName,
      description: newQuestionText,
      categoryId: selectedCategory,
    }) => {
      await trpc.category.getAllWithQuestions.cancel();

      const previousQuestions = trpc.category.getAllWithQuestions.getData();

      trpc.question.getAll.setData(undefined, (prev) => {
        const optimisticQuestion = {
          id: "optimistic-" + Date.now().toString(),
          name: newQuestionName,
          description: newQuestionText,
          categoryId: selectedCategory,
        };
        if (!prev) return [optimisticQuestion];
        return [...prev, optimisticQuestion];
      });

      setNewQuestionName("");
      setNewQuestionText("");

      return { previousQuestions };
    },
  });

  if (categories?.length === 0) {
    return (
      <div>
        <div className="border-b border-gray-900/10 pb-12">
          <h2>Perguntas</h2>
          <p>Impossível criar perguntas sem existirem categorias</p>
          <div>
            <a
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              href={"/categories"}
            >
              Criar categoria
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const result =
            questionName.safeParse(newQuestionName) &&
            questionDescription.safeParse(newQuestionText);

          if (!result.success) {
            toast.error(result.error.format()._errors.join("\n"));
            return;
          }

          mutate({
            name: newQuestionName,
            description: newQuestionText,
            categoryId: selectedCategory,
          });
        }}
      >
        <div>
          <div className="border-b border-gray-900/10 pb-12">
            <h2>Perguntas</h2>
            <p>Criar nova pergunta</p>

            <div>
              <div className="sm:col-span-4">
                <label htmlFor="categorias">Selecionar Categoria:</label>

                <select
                  id="categorias"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                >
                  {categories?.length ? (
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

            <div>
              <div className="sm:col-span-4">
                <label htmlFor="new-question-name">Pergunta:</label>
                <div>
                  <input
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Nova pergunta..."
                    type="text"
                    name="new-question-name"
                    id="new-question-name"
                    value={newQuestionName}
                    onChange={(e) => setNewQuestionName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="sm:col-span-4">
                <label htmlFor="new-question-description">Descrição:</label>
                <div>
                  <textarea
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Descrição..."
                    name="new-question-description"
                    id="new-question-description"
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    value={newQuestionText}
                  ></textarea>
                </div>
              </div>
            </div>
            <div>
              <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Gravar
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}