import toast from "react-hot-toast";
import type { Category } from  "@/types";
import { api } from "@/utils/api";

type CategoryProps = {
  category: Category;
};

export default function Category({ category }: CategoryProps) {
  const { id, name, description } = category;
  const trpc = api.useContext();

  const { mutate: deleteMutation } = api.category.delete.useMutation({
    onMutate: async (deleteId) => {
      await trpc.category.getAll.cancel();

      const previousCategories = trpc.category.getAll.getData();

      trpc.category.getAll.setData(undefined, (prev) => {
        if (!prev) return previousCategories;
        return prev.filter((category) => category.id !== deleteId);
      });

      return { previousCategories };
    },
    onError: (err, newCategory, ctx) => {
      toast.error("Falha ao apagar a categoria");
      trpc.category.getAll.setData(undefined, () => ctx?.previousCategories);
    },
    onSettled: async () => {
      await trpc.category.getAll.invalidate();
    },
  });

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">        
          {name}
        </p>
        <span className="text-xs text-gray-500 dark:text-gray-400">
            {description}
        </span>
      </div>
      <button
        className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        onClick={() => {
          deleteMutation(id);
          toast.success(`Categoria "${name}" apagada!`);
        }}
      >
        Apagar
      </button>
    </div>
  );
}
