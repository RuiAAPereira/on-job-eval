import TableEmployees from "@/components/employees/TableEmployees";
import Wrapper from "@/components/common/Wrapper";
import { useState } from "react";
import toast from "react-hot-toast";
import { DynamicModal } from "@/components/common/DynamicModal";
import { FaUserPlus } from "react-icons/fa6";
import FormEmployee from "@/components/employees/FormEmployee";
import PageHead from "@/components/layout/head";

export default function Employees() {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
    setShowAddModal(false);
  };

  const handleError = (message: string) => {
    toast.error(message);
    setShowAddModal(false);
  };

  return (
    <>
      <PageHead title={"Listagem de Formandos"} />

      <Wrapper>
        <>
          <div className="flex justify-between px-4">
            <h1 className="text-xl ">Formandos</h1>
            <button
              className="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
              onClick={() => setShowAddModal(true)}
            >
              Novo Formando
            </button>
          </div>

          <TableEmployees />

          <DynamicModal
            show={showAddModal}
            icon={<FaUserPlus className="h-6 w-6 text-green-600" />}
            title="Novo formando"
          >
            <FormEmployee
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleCloseModal}
              employee={null}
            />
          </DynamicModal>
        </>
      </Wrapper>
    </>
  );
}
