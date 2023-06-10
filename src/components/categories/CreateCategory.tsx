import { useState } from "react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { categoryName, categoryDescription } from "@/types";
import { set } from "zod";

export default function CreateCategory() {
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");

    const trpc = api.useContext();

    const { mutate } = api.category.create.useMutation({
        onError: (err, { name: newCategoryName }, ctx: { previousCategories?: any[] } = {}) => {
            toast.error("Failed to create category");
            setNewCategoryName(newCategoryName);
            trpc.category.getAll.setData(undefined, () => ctx?.previousCategories);
        },
        onSettled: async () => {
            await trpc.category.getAll.invalidate();
        },
        onMutate: async ({ name: newCategoryName, description: newCategoryDescription }) => {
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
        <div>
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

                    mutate({ name: newCategoryName, description: newCategoryDescription });
                    toast.success("Categoria criada!");
                }}
                className="flex gap-2"
            >
                <input
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Nova Categoria..."
                    type="text"
                    name="new-category-name"
                    id="new-category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <input
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Descrição..."
                    type="text"
                    name="new-category-description"
                    id="new-category-description"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                />
                <button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
                    Gravar
                </button>
            </form>
        </div>
    );
}
