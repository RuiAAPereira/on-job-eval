import { useState } from "react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { categoryName, categoryDescription } from "@/types";
import { set } from "zod";

export default function AddCategory() {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  const trpc = api.useContext();

  const { mutate } = api.category.create.useMutation({
    onError: (
      err,
      { name: newCategoryName },
      ctx: { previousCategories?: any[] } = {}
    ) => {
      toast.error("Falha ao criar categoria");
      setNewCategoryName(newCategoryName);
      trpc.category.getAll.setData(undefined, () => ctx?.previousCategories);
    },
    onSettled: async () => {
      await trpc.category.getAll.invalidate();
    },
    onSuccess: () => {
      toast.success("Categoria criada!");
    },
    onMutate: async ({
      name: newCategoryName,
      description: newCategoryDescription,
    }) => {
      await trpc.category.getAll.cancel();

      const previousCategories = trpc.category.getAll.getData();

      trpc.category.getAll.setData(undefined, (prev) => {
        const optimisticCategory = {
          id: "optimistic-" + Date.now().toString(),
          name: newCategoryName,
          description: newCategoryDescription,
        };
        if (!prev) return [optimisticCategory];
        return [...prev, optimisticCategory];
      });

      setNewCategoryName("");
      setNewCategoryDescription("");

      return { previousCategories };
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const result =
          categoryName.safeParse(newCategoryName) &&
          categoryDescription.safeParse(newCategoryDescription);

        if (!result.success) {
          toast.error(result.error.format()._errors.join("\n"));
          return;
        }

        mutate({
          name: newCategoryName,
          description: newCategoryDescription,
        });
      }}
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-300">
            Categorias
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Criar novas categorias
          </p>

          <div className="mt-10 gap-x-6 gap-y-8">
            <div className="sm:col-span-4">
              <label
                htmlFor="new-category-name"
                className="block text-sm font-medium leading-6 text-gray-400"
              >
                Nome:
              </label>
              <div className="mt-2">
                <input
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Nova Categoria..."
                  type="text"
                  name="new-category-name"
                  id="new-category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="mt-10 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="new-category-description"
                className="block text-sm font-medium leading-6 text-gray-400"
              >
                Descrição:
              </label>
              <div className="mt-2">
                <textarea
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Descrição..."
                  name="new-category-description"
                  id="new-category-description"
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  value={newCategoryDescription}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Gravar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
