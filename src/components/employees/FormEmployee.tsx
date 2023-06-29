import { useState, useEffect } from "react";
import { employeeName, employeeNumber } from "@/types";
import type { Employee } from "@/types";
import { api } from "@/utils/api";

interface Props {
  employee: Employee | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onCancel?: () => void;
}

export default function FormEmployee({
  employee,
  onSuccess,
  onError,
  onCancel,
}: Props) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setNumber(employee.number || 0);
    } else {
      setName("");
      setNumber(0);
    }
  }, [employee]);

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const trpc = api.useContext();

  const { mutate: addEmployee } = api.employee.create.useMutation({
    onError: (
      _err,
      { name: name },
      ctx: { previousEmployees?: Employee[] } = {}
    ) => {
      setName(name);
      trpc.employee.getAll.setData(undefined, () => ctx?.previousEmployees);
      onError && onError("Falha ao criar formando: " + _err.message);
    },
    onSettled: async () => {
      await trpc.employee.getAll.invalidate();
    },
    onSuccess: () => {
      onEmployeeChange();
      onSuccess && onSuccess("Formando criado com sucesso!");
    },
    onMutate: async (data) => {
      await trpc.employee.getAll.cancel();

      const previousEmployees = trpc.employee.getAll.getData();

      trpc.employee.getAll.setData(undefined, (prev) => {
        const optimisticEmployee = {
          id: "optimistic-" + Date.now().toString(),
          name: data.name,
          number: data.number,
        };
        if (!prev) return [optimisticEmployee];
        return [...prev, optimisticEmployee];
      });

      setName("");
      setNumber(0);
      return { previousEmployees };
    },
  });

  const { mutate: editEmployee } = api.employee.update.useMutation({
    onError: (
      _err,
      { name: name },
      ctx: { previousEmployees?: Employee[] } = {}
    ) => {
      setName(name);
      trpc.employee.getAll.setData(undefined, () => ctx?.previousEmployees);
      onError && onError("Falha ao editar formando: " + _err.message);
    },
    onSettled: async () => {
      await trpc.employee.getAll.invalidate();
    },
    onSuccess: () => {
      onEmployeeChange();
      onSuccess && onSuccess("Formando editado com sucesso!");
    },
    onMutate: async (data) => {
      await trpc.employee.getAll.cancel();

      const previousEmployees = trpc.employee.getAll.getData();

      trpc.employee.getAll.setData(undefined, (prev) => {
        const optimisticEmployee = {
          id: "optimistic-" + Date.now().toString(),
          name: data.name,
          number: data.number,
        };
        if (!prev) return [optimisticEmployee];
        return [...prev, optimisticEmployee];
      });

      setName("");
      setNumber(0);
      return { previousEmployees };
    },
  });

  const onEmployeeChange = () => {
    void trpc.employee.employeePaginationWithSearch.invalidate();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result =
      employeeName.safeParse(name) && employeeNumber.safeParse(number);

    if (!result.success) {
      return;
    }

    if (employee) {
      editEmployee({
        id: employee.id,
        name: name,
        number: number,
      });
      return;
    }

    addEmployee({
      name: name,
      number: number,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-center gap-2 pb-2 md:flex-nowrap">
        <label className="w-24" htmlFor="new-employee-number">
          Número:
        </label>

        <input
          className="w-full rounded-md border-2 border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Nova Categoria..."
          type="number"
          name="new-employee-number"
          id="new-employee-number"
          value={number}
          onChange={(e) => setNumber(parseInt(e.target.value))}
          required
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
        <label className="w-24" htmlFor="new-employee-name">
          Nome:
        </label>
        <input
          className="w-full rounded-md border-2 border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Nova Categoria..."
          type="text"
          name="new-employee-name"
          id="new-employee-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
