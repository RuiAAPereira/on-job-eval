import React, { useState } from "react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { categoryName, categoryDescription } from "@/types";

const wait = () => new Promise((resolve) => setTimeout(resolve, 100));

const EditCategory = (data: {
  id: string;
  name: string;
  description: string | null;
}) => {
  const [open, setOpen] = React.useState(false);
  const catId = data.id;
  const [catName, setName] = useState(data.name);
  const [catDescription, setDescription] = useState(data.description || "");

  const trpc = api.useContext();

  const { mutate } = api.category.update.useMutation({
    onError: (
      err,
      { name: catName },
      ctx: { previousCategories?: any[] } = {}
    ) => {
      toast.error("Falha ao atualizar categoria");
      setName(catName);
      trpc.category.getAll.setData(undefined, () => ctx?.previousCategories);
    },
    onSettled: async () => {
      await trpc.category.getAll.invalidate();
    },
    onSuccess: () => {
      toast.success(`"${catName}" atualizada com sucesso!`);
    },
    onMutate: async ({
      id: catId,
      name: catName,
      description: catDescription,
    }) => {
      await trpc.category.getAll.cancel();

      const previousCategories = trpc.category.getAll.getData();

      trpc.category.getAll.setData(undefined, (prev) => {
        const optimisticCategory = {
          id: "optimistic-" + Date.now().toString(),
          name: catName,
          description: catDescription,
        };
        if (!prev) return [optimisticCategory];
        return [...prev, optimisticCategory];
      });

      return { previousCategories };
    },
  });

  return (
    <></>
    // <Dialog.Root open={open} onOpenChange={setOpen} key={data.id}>
    //   <Dialog.Trigger asChild>
    //     <button className="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-orange-500 px-[15px] font-medium leading-none text-gray-200 hover:bg-orange-600 focus:outline-none">
    //       Editar
    //     </button>
    //   </Dialog.Trigger>
    //   <Dialog.Portal>
    //     <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-gray-900/50" />
    //     <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-700 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
    //       <form
    //         onSubmit={(e) => {
    //           wait().then(() => setOpen(false));
    //           e.preventDefault();

    //           const result =
    //             categoryName.safeParse(catName) &&
    //             categoryDescription.safeParse(catDescription);

    //           if (!result.success) {
    //             toast.error(result.error.format()._errors.join("\n"));
    //             return;
    //           }

    //           mutate({
    //             id: catId,
    //             name: catName,
    //             description: catDescription,
    //           });
    //         }}
    //       >
    //         <Dialog.Title className="m-0 text-[17px] font-medium text-blue-300">
    //           Editar categoria
    //         </Dialog.Title>
    //         <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal text-gray-300">
    //           Altere a categoria aqui. Clique em guardar quando terminar.
    //         </Dialog.Description>
    //         <input type="hidden" value={catId} id={catId} name={catId} />
    //         <fieldset className="mb-[15px] flex items-center gap-5">
    //           <label
    //             className="w-[90px] text-right text-[15px] text-gray-200"
    //             htmlFor="name"
    //           >
    //             Nome:
    //           </label>
    //           <input
    //             className="inline-flex w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
    //             id="name"
    //             value={catName}
    //             onChange={(e) => setName(e.target.value)}
    //             required
    //           />
    //         </fieldset>
    //         <fieldset className="mb-[15px] flex items-center gap-5">
    //           <label
    //             className="w-[90px] text-right text-[15px] text-gray-200"
    //             htmlFor="description"
    //           >
    //             Description:
    //           </label>
    //           <textarea
    //             className="inline-flex w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
    //             id="description"
    //             rows={4}
    //             value={catDescription}
    //             onChange={(e) => setDescription(e.target.value)}
    //           ></textarea>
    //         </fieldset>
    //         <div className="mt-[25px] flex justify-end">
    //           <input
    //             className="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-green-400 px-[15px] font-medium leading-none text-green-100 hover:bg-green-500 focus:shadow-[0_0_0_2px] focus:shadow-green-700 focus:outline-none"
    //             type="submit"
    //             value="Guardar"
    //           />
    //         </div>
    //       </form>
    //       <Dialog.Close asChild>
    //         <button
    //           className="text-blue11 hover:bg-blue4 focus:shadow-blue7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
    //           aria-label="Close"
    //         >
    //           <Cross2Icon />
    //         </button>
    //       </Dialog.Close>
    //     </Dialog.Content>
    //   </Dialog.Portal>
    // </Dialog.Root>
  );
};

export default EditCategory;
