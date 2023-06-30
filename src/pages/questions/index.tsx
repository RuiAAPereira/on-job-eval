import Wrapper from "@/components/common/Wrapper";
import { useState } from "react";
import TableQuestions from "@/components/questions/TableQuestions";
import FormQuestion from "@/components/questions/FormQuestion";
import { DynamicModal } from "@/components/common/DynamicModal";
import { FaCirclePlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import PageHead from "@/components/layout/head";

export default function Questions() {
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
      <PageHead title={"Listagem de Perguntas"} />
      <Wrapper>
        <>
          <div className="flex justify-between px-4">
            <h1 className="text-xl ">Perguntas</h1>
            <button
              className="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
              onClick={() => setShowAddModal(true)}
            >
              Nova Pergunta
            </button>
          </div>
          <TableQuestions />
          <DynamicModal
            show={showAddModal}
            icon={<FaCirclePlus className="h-6 w-6 text-green-600" />}
            title="Nova Pergunta"
          >
            <FormQuestion
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleCloseModal}
              question={null}
            />
          </DynamicModal>
        </>
      </Wrapper>
    </>
  );
}
