import { api } from "@/utils/api";

type props = {
  employeeId: string;
};

export default function EmployeeEvaluations({ employeeId }: props) {
  const {
    data: evaluations,
    isLoading,
    isError,
  } = api.evaluation.getByEmployeeId.useQuery(employeeId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <>
      {evaluations.length ? (
        evaluations?.map((c) => {
          return <p key={c.id}>{c.id}</p>;
        })
      ) : (
        <p>Este formando ainda não tem avaliações</p>
      )}
    </>
  );
}
