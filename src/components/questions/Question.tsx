import toast from "react-hot-toast";
import { api } from "@/utils/api";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Questions } from "@/types";

type QuestionProps = {
  question: Questions;
};

export default function Question({ question }: QuestionProps) {
  const { id, name, description } = question;
  const trpc = api.useContext();

  const { mutate: deleteMutation } = api.question.delete.useMutation({
    onMutate: async (deleteId) => {
      await trpc.category.getAllWithQuestions.cancel();

      const previousCategories = trpc.category.getAllWithQuestions.getData();

      trpc.category.getAllWithQuestions.setData(undefined, (prev) => {
        if (!prev) return previousCategories;
        return prev.filter((question) => question.id !== deleteId);
      });

      return { previousCategories };
    },
    onSuccess: () => {
      toast.success(`"${name}" apagada com sucesso!`);
    },
    onError: (err, newQuestion, ctx) => {
      toast.error("Falha ao apagar a categoria");
      trpc.category.getAllWithQuestions.setData(
        undefined,
        () => ctx?.previousCategories
      );
    },
    onSettled: async () => {
      await trpc.category.getAllWithQuestions.invalidate();
    },
  });

  return (
    <tr
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
      key={`question-${id}`}
    >
      <th
        scope="row"
        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
      >
        {name}
      </th>
      <td className="px-6 py-4">
        {description ? (
          description
        ) : (
          <span className="text-gray-400">Sem descrição</span>
        )}
      </td>
      <td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
        {/* <EditQuestion id={id} name={name} description={description} /> */}
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button className="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-blue-500 px-[15px] font-medium leading-none text-blue-100 hover:bg-blue-600 focus:outline-none">
              Apagar
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="data-[state=open]:animate-overlayShow bg-blackA9 fixed inset-0" />
            <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-700 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <AlertDialog.Title className="m-0 text-[17px] font-medium text-red-400">
                Tem a certeza que deseja apagar?
              </AlertDialog.Title>
              <AlertDialog.Description className="mb-5 mt-4 text-[15px] leading-normal text-red-100">
                Esta ação não pode ser revertida.
                <br />
                <span>
                  Esta pergunta e respostas associadas serão apagadas.
                </span>
              </AlertDialog.Description>
              <div className="flex justify-end gap-[25px]">
                <AlertDialog.Cancel asChild>
                  <button className="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-orange-400 px-[15px] font-medium leading-none text-orange-100 outline-none hover:bg-orange-500 focus:shadow-[0_0_0_2px] focus:shadow-orange-700">
                    Cancelar
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    className="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-red-400 px-[15px] font-medium leading-none text-red-100 outline-none hover:bg-red-500 focus:shadow-[0_0_0_2px] focus:shadow-red-700"
                    onClick={() => {
                      deleteMutation(id);
                    }}
                  >
                    Apagar
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </td>
    </tr>
  );
}
