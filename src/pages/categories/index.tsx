import Head from "next/head";
import TableCategories from "@/components/categories/TableCategories";
import Wrapper from "@/components/common/Wrapper";
import React, { useState } from "react";
import { DynamicModal } from "@/components/common/DynamicModal";
import { FaUserMinus } from "react-icons/fa6";
import FormCategory from "@/components/categories/FormCategory";
import toast from "react-hot-toast";

export default function Categories() {
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
      <Head>
        <title>Categorias</title>
        <meta name="description" content="On job evaluation" />
        <link rel="shortcut icon" href="public/favicon.ico" />
      </Head>
      <Wrapper>
        <>
          <div className="flex justify-between px-4">
            <h1 className="text-xl ">Categorias</h1>
            <button
              className="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
              onClick={() => setShowAddModal(true)}
            >
              Nova Categoria
            </button>
          </div>
          <TableCategories />

          <DynamicModal
            show={showAddModal}
            icon={<FaUserMinus className="h-6 w-6 text-red-600" />}
            title="Nova Categoria"
          >
            <FormCategory
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleCloseModal}
              category={null}
            />
          </DynamicModal>
        </>
      </Wrapper>
    </>
  );
}
