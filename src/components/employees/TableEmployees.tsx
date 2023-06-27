import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { Employee } from "@/types";
import Pagination from "../common/pagination";
import { DynamicTable } from "../common/DynamicTable";
import Link from "next/link";

export default function TableEmployees() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState<Employee[]>([]);

  const {
    data: searchResults,
    isLoading,
    isError,
  } = api.employee.employeePaginationWithSearch.useQuery({
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
    setTableData(searchResults?.employees ?? []);
  }, [searchResults]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  const columns = [
    {
      title: "Número",
      dataIndex: "number",
    },
    {
      title: "Nome",
      dataIndex: "name",
    },
    {
      title: "Ações",
      dataIndex: null,
      render: (record: Employee) => (
        <>
          <Link href={`/employees/${record.id}/details`}>Ver</Link>
          {" | "}
          <Link href={`/employees/${record.id}/edit`}>Excluir</Link>
        </>
      ),
    },
  ];

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
        <Pagination
          page={page}
          currentPage={searchResults?.currentPage}
          totalPages={searchResults?.totalPages}
          onPageChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}
