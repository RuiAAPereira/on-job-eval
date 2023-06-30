import { useState, useEffect } from "react";
import { questionName, questionDescription } from "@/types";
import type { Question } from "@/types";
import { api } from "@/utils/api";

interface Props {
  question: Question | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onCancel?: () => void;
}

export default function FormQuestion({
  question,
  onSuccess,
  onError,
  onCancel,
}: Props) {
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories } = api.category.getAll.useQuery();

  useEffect(() => {
    if (question) {
      setName(question.name);
      setDescription(question.description || "");
      setCategoryId(question.categoryId);
    } else {
      setName("");
      setDescription("");
      setCategoryId("");
    }
  }, [question]);

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const trpc = api.useContext();

  const { mutate: addQuestion } = api.question.create.useMutation({
    onError: (
      _err,
      { name: name },
      ctx: { previousQuestions?: Question[] } = {}
    ) => {
      setName(name);
      trpc.question.getAll.setData(undefined, () => ctx?.previousQuestions);
      onError && onError("Falha ao criar pergunta: " + _err.message);
    },
    onSettled: async () => {
      await trpc.question.getAll.invalidate();
    },
    onSuccess: () => {
      onQuestionChange();
      onSuccess && onSuccess("Pergunta criada com sucesso!");
    },
    onMutate: async (data) => {
      await trpc.question.getAll.cancel();

      const previousQuestions = trpc.question.getAll
        .getData()
        ?.map((question) => ({
          ...question,
          categoryId: "example", // add categoryId property
        }));

      trpc.question.getAll.setData(undefined, (prev) => {
        const optimisticQuestion = {
          id: "optimistic-" + Date.now().toString(),
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
        };
        if (!prev) return [optimisticQuestion];
        return [...prev, optimisticQuestion];
      });

      setName("");
      setDescription("");
      setCategoryId("");
      return { previousQuestions };
    },
  });

  const { mutate: editQuestion } = api.question.update.useMutation({
    onError: (
      _err,
      { name: name },
      ctx: { previousQuestions?: Question[] } = {}
    ) => {
      setName(name);
      trpc.question.getAll.setData(undefined, () => ctx?.previousQuestions);
      onError && onError("Falha ao editar categoria: " + _err.message);
    },
    onSettled: async () => {
      await trpc.question.getAll.invalidate();
    },
    onSuccess: () => {
      onQuestionChange();
      onSuccess && onSuccess("Pergunta editada com sucesso!");
    },
    onMutate: async (data) => {
      await trpc.question.getAll.cancel();

      const previousQuestions = trpc.question.getAll
        .getData()
        ?.map((question) => ({
          ...question,
          categoryId: "example", // add categoryId property
        }));

      trpc.question.getAll.setData(undefined, (prev) => {
        const optimisticQuestion = {
          id: "optimistic-" + Date.now().toString(),
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
        };
        if (!prev) return [optimisticQuestion];
        return [...prev, optimisticQuestion];
      });

      setName("");
      setDescription("");
      setCategoryId("");
      return { previousQuestions };
    },
  });

  const onQuestionChange = () => {
    void trpc.question.questionsPaginationWithSearch.invalidate();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result =
      questionName.safeParse(name) &&
      questionDescription.safeParse(description);

    if (!result.success) {
      return;
    }

    if (question) {
      editQuestion({
        id: question.id,
        name: name,
        description: description,
        categoryId: question.categoryId,
      });
      return;
    }

    addQuestion({
      name: name,
      description: description,
      categoryId: categoryId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-center gap-2 pb-2 md:flex-nowrap">
        <label className="w-24" htmlFor="new-question-category">
          Categoria:
        </label>
        <select
          className="w-full rounded-md border-2 border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          name="new-question-category"
          id="new-question-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2 pb-2 md:flex-nowrap">
        <label className="w-24" htmlFor="new-question-name">
          Nome:
        </label>
        <input
          className="w-full rounded-md border-2 border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Nova Categoria..."
          type="text"
          name="new-question-name"
          id="new-question-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
        <label className="w-24" htmlFor="new-question-description">
          Descrição:
        </label>

        <textarea
          className="w-full rounded-md border-2 border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Descrição..."
          name="new-question-description"
          id="new-question-description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></textarea>
      </div>
      <div className="mt-4 gap-2 text-center md:flex md:justify-end md:text-right">
        <button
          className="block w-full rounded-lg bg-green-200 px-4 py-3 text-sm font-semibold text-green-700 md:order-2 md:ml-2 md:inline-block md:w-auto md:py-2"
          type="submit"
        >
          Gravar
        </button>
        <button
          className="mt-4 block w-full rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold md:order-1 md:mt-0 md:inline-block md:w-auto md:py-2"
          type="button"
          onClick={handleCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
