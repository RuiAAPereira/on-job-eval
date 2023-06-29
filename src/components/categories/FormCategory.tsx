import { useState, useEffect } from "react";
import { categoryName, categoryDescription } from "@/types";
import type { Category } from "@/types";
import { api } from "@/utils/api";

interface Props {
  category: Category | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onCancel?: () => void;
}

export default function FormCategory({
  category,
  onSuccess,
  onError,
  onCancel,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [category]);

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const trpc = api.useContext();

  const { mutate: addCategory } = api.category.create.useMutation({
    onError: (
      _err,
      { name: name },
      ctx: { previousCategories?: Category[] } = {}
    ) => {
      setName(name);
      trpc.category.getAll.setData(undefined, () => ctx?.previousCategories);
      onError && onError("Falha ao criar categoria: " + _err.message);
    },
    onSettled: async () => {
      await trpc.category.getAll.invalidate();
    },
    onSuccess: () => {
      onCategoryChange();
      onSuccess && onSuccess("Categoria criada com sucesso!");
    },
    onMutate: async (data) => {
      await trpc.category.getAll.cancel();

      const previousCategories = trpc.category.getAll.getData();

      trpc.category.getAll.setData(undefined, (prev) => {
        const optimisticCategory = {
          id: "optimistic-" + Date.now().toString(),
          name: data.name,
          description: data.description,
        };
        if (!prev) return [optimisticCategory];
        return [...prev, optimisticCategory];
      });

      setName("");
      setDescription("");
      return { previousCategories };
    },
  });

  const { mutate: editCategory } = api.category.update.useMutation({
    onError: (
      _err,
      { name: name },
      ctx: { previousCategories?: Category[] } = {}
    ) => {
      setName(name);
      trpc.category.getAll.setData(undefined, () => ctx?.previousCategories);
      onError && onError("Falha ao editar categoria: " + _err.message);
    },
    onSettled: async () => {
      await trpc.category.getAll.invalidate();
    },
    onSuccess: () => {
      onCategoryChange();
      onSuccess && onSuccess("Categoria editada com sucesso!");
    },
    onMutate: async (data) => {
      await trpc.category.getAll.cancel();

      const previousCategories = trpc.category.getAll.getData();

      trpc.category.getAll.setData(undefined, (prev) => {
        const optimisticCategory = {
          id: "optimistic-" + Date.now().toString(),
          name: data.name,
          description: data.description,
        };
        if (!prev) return [optimisticCategory];
        return [...prev, optimisticCategory];
      });

      setName("");
      setDescription("");
      return { previousCategories };
    },
  });

  const onCategoryChange = () => {
    void trpc.category.categoryPaginationWithSearch.invalidate();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result =
      categoryName.safeParse(name) &&
      categoryDescription.safeParse(description);

    if (!result.success) {
      return;
    }

    if (category) {
      editCategory({
        id: category.id,
        name: name,
        description: description,
      });
      return;
    }

    addCategory({
      name: name,
      description: description,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-center gap-2 pb-2 md:flex-nowrap">
        <label className="w-24" htmlFor="new-category-name">
          Nome:
        </label>
        <input
          className="w-full rounded-md border-2 border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Nova Categoria..."
          type="text"
          name="new-category-name"
          id="new-category-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
        <label className="w-24" htmlFor="new-category-description">
          Descrição:
        </label>

        <textarea
          className="w-full rounded-md border-2 border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Descrição..."
          name="new-category-description"
          id="new-category-description"
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
