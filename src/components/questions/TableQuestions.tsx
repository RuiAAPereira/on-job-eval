import { api } from "@/utils/api";
import type { Question } from "@/types";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCircleMinus, FaPencil } from "react-icons/fa6";
import { DynamicTable } from "../common/DynamicTable";
import { DynamicModal } from "../common/DynamicModal";
import DynamicPagination from "../common/DynamicPagination";
import FormQuestion from "./FormQuestion";
import Loading from "../common/Loading";
import Error404 from "../common/Error404";

export default function TableQuestions() {
  const trpc = api.useContext();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState<Question[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");

  const [showEditModal, setShowEditModal] = React.useState(false);
  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  const { mutate: deleteMutation } = api.question.delete.useMutation({
    onMutate: async () => {
      await trpc.question.questionsPaginationWithSearch.cancel();

      const previousQuestions =
        trpc.question.questionsPaginationWithSearch.getData();

      trpc.question.questionsPaginationWithSearch.setData(
        { search: filter, take: 15, skip: page * 15 },
        (prev) => {
          if (!prev) return previousQuestions;
          return previousQuestions;
        }
      );

      return { previousQuestions };
    },
    onSuccess: () => {
      toast.success("Pergunta apagada com sucesso!");
    },
    onError: (_err, _newQuestion, ctx) => {
      toast.error("Falha ao apagar a pergunta!");
      trpc.question.questionsPaginationWithSearch.setData(
        { search: filter, take: 15, skip: page * 15 },
        () => ctx?.previousQuestions
      );
    },
    onSettled: async () => {
      await trpc.question.questionsPaginationWithSearch.invalidate();
    },
  });

  const {
    data: searchResults,
    isLoading,
    isError,
  } = api.question.questionsPaginationWithSearch.useQuery({
    search: filter,
    take: 15,
    skip: page * 15,
  });

  useEffect(() => {
    const timeOutId = setTimeout(() => setFilter(query), 1000);
    return () => clearTimeout(timeOutId);
  }, [query]);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  useEffect(() => {
    const updatedTableData =
      searchResults?.questions.map((question) => ({
        ...question,
        categoryId: question.categoryid,
      })) ?? [];
    setTableData(updatedTableData);
  }, [searchResults]);

  if (isLoading) return <Loading />;

  if (isError) return <Error404 />;

  const columns = [
    {
      title: "Categoria",
      dataIndex: "categoryName",
    },
    {
      title: "Nome",
      dataIndex: "name",
    },
    {
      title: "Descrição",
      dataIndex: "description",
    },
    {
      title: "Ações",
      dataIndex: null,
      render: (record: Question) => (
        <>
          <button
            onClick={() => {
              setShowEditModal(true);
              setSelectedQuestion(record);
            }}
          >
            Editar
          </button>
          {" | "}
          <button
            onClick={() => {
              setShowModal(true);
              setSelectedQuestionId(record.id);
            }}
          >
            Excluir
          </button>
        </>
      ),
    },
  ];

  const handleSuccess = (message: string) => {
    toast.success(message);
    setShowEditModal(false);
  };

  const handleError = (message: string) => {
    toast.error(message);
    setShowEditModal(false);
  };

  return (
    <div className="relative mt-8 overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center gap-4 p-4">
        <label htmlFor="search">Procurar:</label>
        <input
          id="search"
          type="text"
          className="rounded-md border-2 border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div>
        <DynamicTable data={tableData} columns={columns} />
        {searchResults?.totalPages > 1 && (
          <DynamicPagination
            page={page}
            currentPage={searchResults?.currentPage}
            totalPages={searchResults?.totalPages}
            onPageChange={(page) => setPage(page)}
          />
        )}
      </div>
      {showModal ? (
        <>
          {showModal && (
            <>
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/50 outline-none  focus:outline-none">
                <div className="fixed inset-x-0 bottom-0 z-50 mx-4 mb-4 rounded-lg bg-white p-4 md:relative md:mx-auto md:max-w-md">
                  <div className="items-center md:flex">
                    <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-gray-300">
                      <FaCircleMinus className="text-red-500" />
                    </div>
                    <div className="mt-4 text-center md:ml-6 md:mt-0 md:text-left">
                      <p className="font-bold">
                        Tem a certeza que deseja apagar?
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        Esta ação não pode ser revertida.
                        <br />
                        <span>
                          Todos os dados referentes a esta pergunta serão
                          apagados.
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center md:flex md:justify-end md:text-right">
                    <button
                      className="block w-full rounded-lg bg-red-200 px-4 py-3 text-sm font-semibold text-red-700 md:order-2 md:ml-2 md:inline-block md:w-auto md:py-2"
                      onClick={() => {
                        deleteMutation(selectedQuestionId);
                        setShowModal(false);
                      }}
                    >
                      Apagar
                    </button>
                    <button
                      className="mt-4 block w-full rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold md:order-1 md:mt-0 md:inline-block
          md:w-auto md:py-2"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : null}

      <DynamicModal
        show={showEditModal}
        icon={<FaPencil className="h-6 w-6 text-orange-600" />}
        title="Editar pergunta"
      >
        <FormQuestion
          onSuccess={handleSuccess}
          onError={handleError}
          onCancel={handleCloseModal}
          question={selectedQuestion}
        />
      </DynamicModal>
    </div>
  );
}
