import { api } from "@/utils/api";
import Wrapper from "@/components/common/Wrapper";
import EmployeeEvaluations from "@/components/employees/EmployeeEvaluations";
import Loading from "@/components/common/Loading";
import PageHead from "@/components/layout/head";
import Error404 from "@/components/common/Error404";

export function getServerSideProps(context: {
  params: Record<string, unknown>;
}) {
  return {
    props: { params: context.params },
  };
}

interface EmployeeDetailsProps {
  params: {
    id: string;
  };
}

export default function EmployeeDetails({ params }: EmployeeDetailsProps) {
  const { id } = params;

  const {
    data: employee,
    isError,
    isLoading,
  } = api.employee.getById.useQuery(id);

  if (isLoading) return <Loading />;

 if (isError) return <Error404 />;

  return (
    <>
      <PageHead title={"Detalhes Formando"} />

      <Wrapper>
        <div className="relative mt-8 overflow-x-auto p-6 shadow-md sm:rounded-lg">
          {employee && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-8 shadow-xl">
                <h4 className="text-xl font-bold text-gray-900">
                  {employee?.name}
                </h4>
                <ul className="mt-2 text-gray-700">
                  <li className="flex border-y py-2">
                    <span className="w-24 font-bold">Número:</span>
                    <span className="text-gray-700">
                      {employee?.number ? employee.number : 0}
                    </span>
                  </li>
                </ul>
              </div>
              <EmployeeEvaluations employeeId={id} />
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
}
