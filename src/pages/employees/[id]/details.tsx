import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Wrapper from "@/components/common/Wrapper";
import EmployeeEvaluations from "@/components/employees/EmployeeEvaluations";

export default function EmployeeDetails() {
  const { query } = useRouter();

  const {
    data: employee,
    isError,
    isLoading,
  } = api.employee.getById.useQuery(String(query.id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <Head>
        <title>Detalhes</title>
        <meta name="description" content="On job evaluation" />
        <link rel="icon" href="public/favicon.ico" />
      </Head>

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
                    {/* <li className="flex border-b py-2">
                      <span className="w-24 font-bold">Birthday:</span>
                      <span className="text-gray-700">24 Jul, 1991</span>
                    </li>
                    <li className="flex border-b py-2">
                      <span className="w-24 font-bold">Joined:</span>
                      <span className="text-gray-700">
                        10 Jan 2022 (25 days ago)
                      </span>
                    </li>
                    <li className="flex border-b py-2">
                      <span className="w-24 font-bold">Mobile:</span>
                      <span className="text-gray-700">(123) 123-1234</span>
                    </li>
                    <li className="flex border-b py-2">
                      <span className="w-24 font-bold">Email:</span>
                      <span className="text-gray-700">
                        amandaross@example.com
                      </span>
                    </li>
                    <li className="flex border-b py-2">
                      <span className="w-24 font-bold">Location:</span>
                      <span className="text-gray-700">New York, US</span>
                    </li>
                    <li className="flex border-b py-2">
                      <span className="w-24 font-bold">Languages:</span>
                      <span className="text-gray-700">English, Spanish</span>
                    </li> */}
                  </ul>

              </div>
              <EmployeeEvaluations employeeId={String(query.id)} />
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
}
