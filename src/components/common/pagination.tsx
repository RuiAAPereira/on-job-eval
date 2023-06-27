interface PaginationProps {
  page: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  page,
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
  };

  const renderPageButton = (pageNumber: number) => (
    <button
      key={pageNumber}
      onClick={() => handlePageChange(pageNumber)}
      disabled={page === pageNumber}
      className={`rounded-l bg-gray-200 px-4 py-2 font-bold text-gray-600 hover:bg-gray-300 ${
        page === pageNumber ? "bg-blue-200" : ""
      }`}
    >
      {pageNumber + 1}
    </button>
  );

  const renderFirstPageButton = () => (
    <button
      key="first"
      onClick={() => handlePageChange(0)}
      disabled={page === 0}
      className="rounded-l bg-gray-200 px-4 py-2 font-bold text-gray-600 hover:bg-gray-300"
    >
      Primeira
    </button>
  );

  const renderLastPageButton = () => (
    <button
      key="last"
      onClick={() => handlePageChange(totalPages - 1)}
      disabled={page === totalPages - 1}
      className="rounded-r bg-gray-200 px-4 py-2 font-bold text-gray-600 hover:bg-gray-300"
    >
      Última
    </button>
  );

  const renderPrevPageButton = () => (
    <button
      key="prev"
      onClick={() => handlePageChange(page - 1)}
      disabled={page === 0}
      className="bg-gray-200 px-4 py-2 font-bold text-gray-600 hover:bg-gray-300"
    >
      Anterior
    </button>
  );

  const renderNextPageButton = () => (
    <button
      key="next"
      onClick={() => handlePageChange(page + 1)}
      disabled={page === totalPages - 1}
      className="rounded-r bg-gray-200 px-4 py-2 font-bold text-gray-600 hover:bg-gray-300"
    >
      Próximo
    </button>
  );

  const renderPageButtons = () => {
    const buttons = [];

    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
        buttons.push(renderPageButton(i));
      }
    } else {
      if (page < 4) {
        for (let i = 0; i < 5; i++) {
          buttons.push(renderPageButton(i));
        }
        buttons.push(<span key="ellipsis1">...</span>);
        buttons.push(renderPageButton(totalPages - 1));
      } else if (page > totalPages - 5) {
        buttons.push(renderPageButton(0));
        buttons.push(<span key="ellipsis2">...</span>);
        for (let i = totalPages - 5; i < totalPages; i++) {
          buttons.push(renderPageButton(i));
        }
      } else {
        buttons.push(renderPageButton(0));
        buttons.push(<span key="ellipsis3">...</span>);
        for (let i = page - 2; i <= page + 2; i++) {
          buttons.push(renderPageButton(i));
        }
        buttons.push(<span key="ellipsis4">...</span>);
        buttons.push(renderPageButton(totalPages - 1));
      }
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="space-x-2">
        {renderFirstPageButton()}
        {renderPrevPageButton()}
        {renderPageButtons()}
        {renderNextPageButton()}
        {renderLastPageButton()}
      </div>
      <span>
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
