import { useState } from "react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { employeeName, employeeNumber } from "@/types";

export default function AddEmployee() {
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeNumber, setNewEmployeeNumber] = useState(0);

  const trpc = api.useContext();

  const { mutate } = api.employee.create.useMutation({
    onError: (
      err,
      { name: newEmployeeName, number: newEmployeeNumber },
      ctx: { previousEmployees?: any[] } = {}
    ) => {
      toast.error("Falha ao criar formando!");
      setNewEmployeeName(newEmployeeName);
      setNewEmployeeNumber(newEmployeeNumber);
      trpc.employee.getAll.setData(undefined, () => ctx?.previousEmployees);
    },
    onSettled: async () => {
      await trpc.employee.getAll.invalidate();
    },
    onSuccess: () => {
      toast.success("Formando criado com sucesso!");
    },
    onMutate: async ({ name: newEmployeeName, number: newEmployeeNumber }) => {
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

      setNewEmployeeName("");
      setNewEmployeeNumber(0);

      return { previousEmployees };
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const result =
          employeeName.safeParse(newEmployeeName) &&
          employeeNumber.safeParse(newEmployeeNumber);

        if (!result.success) {
          toast.error(result.error.format()._errors.join("\n"));
          return;
        }

        mutate({
          name: newEmployeeName,
          number: newEmployeeNumber,
        });
      }}
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-300">
            Formandos
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Criar novo formando
          </p>

          <div className="mt-10 gap-x-6 gap-y-8">
            <div className="sm:col-span-4">
              <label
                htmlFor="new-employee-name"
                className="block text-sm font-medium leading-6 text-gray-400"
              >
                Nome:
              </label>
              <div className="mt-2">
                <input
                  className="input"
                  placeholder="Nome do formando..."
                  type="text"
                  name="new-employee-name"
                  id="new-employee-name"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="mt-10 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="new-employee-description"
                className="block text-sm font-medium leading-6 text-gray-400"
              >
                Número:
              </label>
              <div className="mt-2">
                <input
                  className="input"
                  placeholder="Número do formando..."
                  type="number"
                  name="new-employee-description"
                  id="new-employee-description"
                  value={newEmployeeNumber}
                  onChange={(e) =>
                    setNewEmployeeNumber(parseInt(e.target.value))
                  }
                />
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
