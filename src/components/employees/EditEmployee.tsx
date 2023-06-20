import React, { useState } from "react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { employeeName, employeeNumber } from "@/types";

const wait = () => new Promise((resolve) => setTimeout(resolve, 100));

const EditEmployee = (data: {
  id: string;
  name: string;
  number: number | null;
}) => {
  const [open, setOpen] = React.useState(false);
  const employeeId = data.id;
  const [newEmployeeName, setName] = useState(data.name);
  const [newEmployeeNumber, setNumber] = useState(data.number || 0);

  const trpc = api.useContext();

  const { mutate } = api.employee.update.useMutation({
    onError: (
      err,
      { name: newEmployeeName, number: newEmployeeNumber },
      ctx: { previousEmployees?: any[] } = {}
    ) => {
      toast.error("Falha ao atualizar categoria");
      setName(newEmployeeName);
      setNumber(newEmployeeNumber);
      trpc.employee.getAll.setData(undefined, () => ctx?.previousEmployees);
    },
    onSettled: async () => {
      await trpc.employee.getAll.invalidate();
    },
    onSuccess: () => {
      toast.success(`"${newEmployeeName}" atualizado com sucesso!`);
    },
    onMutate: async ({
      id: employeeId,
      name: newEmployeeName,
      number: newEmployeeNumber,
    }) => {
      await trpc.employee.getAll.cancel();
      const previousEmployees = trpc.employee.getAll.getData();

      trpc.employee.getAll.setData(undefined, (prev) => {
        const optimisticEmployee = {
          id: "optimistic-" + Date.now().toString(),
          name: newEmployeeName,
          number: newEmployeeNumber,
        };
        if (!prev) return [optimisticEmployee];
        return [...prev, optimisticEmployee];
      });

      return { previousEmployees };
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} key={data.id}>
      <Dialog.Trigger asChild>
        <button className="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-orange-500 px-[15px] font-medium leading-none text-gray-200 hover:bg-orange-600 focus:outline-none">
          Editar
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-gray-900/50" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-700 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <form
            onSubmit={(e) => {
              wait().then(() => setOpen(false));
              e.preventDefault();

              const result =
                employeeName.safeParse(newEmployeeName) &&
                employeeNumber.safeParse(newEmployeeNumber);

              if (!result.success) {
                toast.error(result.error.format()._errors.join("\n"));
                return;
              }

              mutate({
                id: employeeId,
                name: newEmployeeName,
                number: newEmployeeNumber,
              });
            }}
          >
            <Dialog.Title className="m-0 text-[17px] font-medium text-blue-300">
              Editar Formando
            </Dialog.Title>
            <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal text-gray-300">
              Altere o formando aqui. Clique em guardar quando terminar.
            </Dialog.Description>
            <input
              type="hidden"
              value={employeeId}
              id={employeeId}
              name={employeeId}
            />
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-gray-200"
                htmlFor="name"
              >
                Nome:
              </label>
              <input
                id="name"
                value={newEmployeeName}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label htmlFor="new-employee-description">Número:</label>
              <div>
                <input
                  placeholder="Número do formando..."
                  type="number"
                  name="new-employee-name"
                  id="new-employee-name"
                  value={newEmployeeNumber}
                  onChange={(e) => setNumber(parseFloat(e.target.value))}
                />
              </div>
            </fieldset>
            <div className="mt-[25px] flex justify-end">
              <input
                className="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-green-400 px-[15px] font-medium leading-none text-green-100 hover:bg-green-500 focus:shadow-[0_0_0_2px] focus:shadow-green-700 focus:outline-none"
                type="submit"
                value="Guardar"
              />
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="text-blue11 hover:bg-blue4 focus:shadow-blue7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditEmployee;
