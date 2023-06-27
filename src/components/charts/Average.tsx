import {
  FaLeanpub,
  FaUsers,
  FaChartPie,
  FaClipboardQuestion,
} from "react-icons/fa6";

import { api } from "@/utils/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Average() {
  const {
    data: evaluationCount,
    isLoading,
    isError,
  } = api.category.getAllWithQuestionsAndAnswers.useQuery();

  const data = {
    labels: evaluationCount?.map((category) => category.name),
    datasets: [
      {
        label: "Média",
        data: evaluationCount?.map((category) => category.averageScore),
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
      {
        label: "Questões",
        data: evaluationCount?.map((category) => category.questionCount),
        backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  const totalEvaluations = api.evaluation.getCount.useQuery().data;
  const totalUsers = api.employee.getCount.useQuery().data;
  const averageScore = api.answer.getAverageScore.useQuery().data;
  const totalQuestions = api.question.getCount.useQuery().data;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <>
      <section className="body-font text-gray-600">
        <div className="container mx-auto px-5 py-24">
          <div className="mb-20 flex w-full flex-col text-center">
            <h1 className="title-font mb-4 text-2xl font-medium text-gray-900 sm:text-3xl">
              Avaliação On Job Training
            </h1>
            <p className="mx-auto text-base leading-relaxed lg:w-2/3">
              Aplicação para avaliação de On Job Training <br />
              Os formandos são avaliados pelo seu comportamento, atitude e
              desempenho durante o período de formação on job training. com um
              sistema de avaliação de 1 a 5. espalhados por 14 categorias e por
              um total de 49 questões.
            </p>
          </div>
          <div className="-m-4 flex flex-wrap text-center">
            <div className="w-full p-4 sm:w-1/2 md:w-1/4">
              <div className="rounded-lg border-2 border-gray-200 px-4 py-6">
                <FaLeanpub className="mb-3 inline-block h-12 w-12 text-indigo-500" />
                <h2 className="title-font text-3xl font-medium text-gray-900">
                  {totalEvaluations}
                </h2>
                <p className="leading-relaxed">Avaliações Realizadas</p>
              </div>
            </div>
            <div className="w-full p-4 sm:w-1/2 md:w-1/4">
              <div className="rounded-lg border-2 border-gray-200 px-4 py-6">
                <FaUsers className="mb-3 inline-block h-12 w-12 text-indigo-500" />
                <h2 className="title-font text-3xl font-medium text-gray-900">
                  {totalUsers}
                </h2>
                <p className="leading-relaxed">Formandos</p>
              </div>
            </div>
            <div className="w-full p-4 sm:w-1/2 md:w-1/4">
              <div className="rounded-lg border-2 border-gray-200 px-4 py-6">
                <FaChartPie className="mb-3 inline-block h-12 w-12 text-indigo-500" />
                <h2 className="title-font text-3xl font-medium text-gray-900">
                  {averageScore?.toFixed(2)}
                </h2>
                <p className="leading-relaxed">Média</p>
              </div>
            </div>
            <div className="w-full p-4 sm:w-1/2 md:w-1/4">
              <div className="rounded-lg border-2 border-gray-200 px-4 py-6">
                <FaClipboardQuestion className="mb-3 inline-block h-12 w-12 text-indigo-500" />
                <h2 className="title-font text-3xl font-medium text-gray-900">
                  {totalQuestions}
                </h2>
                <p className="leading-relaxed">Questões</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hidden items-center justify-center md:flex">
        <div className="w-2/3">
          <Bar options={options} data={data} />
        </div>
      </section>
    </>
  );
}

export default Average;
