import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import Answer from "./Answer";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Loading from "../common/Loading";
import Error404 from "../common/Error404";

interface FormEvaluationProps {
  employeeId: string;
}

export default function FormEvaluation(props: FormEvaluationProps) {
  const {
    data: categories,
    isLoading,
    isError,
  } = api.category.getAllWithQuestions.useQuery();

  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (categories) {
      const defaultAnswers = categories.reduce((acc, category) => {
        category.questions.forEach((question) => {
          acc[question.id] = 1;
        });
        return acc;
      }, {} as Record<string, number>);
      setAnswers(defaultAnswers);
    }
  }, [categories]);

  const { mutateAsync: addEvaluation } = api.evaluation.create.useMutation({
    onSuccess: async (data) => {
      const answersArray = Object.entries(answers).map(
        ([questionId, score]) => ({
          questionId,
          score,
        })
      );

      const promises = answersArray.map((answer) =>
        addAnswer({
          evaluationId: data.id,
          questionId: answer.questionId,
          score: answer.score,
        })
      );

      try {
        await Promise.all(promises);
        await router.push("/employees/" + props.employeeId + "/details");
      } catch (err) {
        console.error(err);
        toast.error("Erro ao salvar respostas");
      }
    },
  });

  const handleSubmit = async () => {
    try {
      const data = await addEvaluation({
        employeeId: props.employeeId,
      });

      const answersArray = Object.entries(answers).map(
        ([questionId, score]) => ({
          questionId,
          score,
        })
      );

      const promises = answersArray.map((answer) =>
        addAnswer({
          evaluationId: data.id,
          questionId: answer.questionId,
          score: answer.score,
        })
      );

      await Promise.all(promises);
      await router.push("/employees/" + props.employeeId + "/details");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar avaliação");
    }
  };

  const router = useRouter();

  const { mutate: addAnswer } = api.answer.create.useMutation();

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  if (isLoading) return <Loading />;

  if (isError) return <Error404 />;

  return (
    <div className="col-span-2 rounded-lg bg-white p-8 shadow-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit()
            .then(() => {
              console.log("handleSubmit");
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      >
        {categories && categories.length ? (
          categories?.map((c) => {
            return (
              <div key={c.id}>
                <h4 className="border-b pb-2 text-xl font-bold text-orange-600">
                  {c.name}
                </h4>

                {c.questions.map((q) => {
                  return (
                    <Answer
                      key={q.id}
                      question={q}
                      onChange={(value: number) =>
                        handleAnswerChange(q.id, value)
                      }
                    />
                  );
                })}
              </div>
            );
          })
        ) : (
          <div>
            <h2>Nenhuma pergunta encontrada</h2>
          </div>
        )}

        <div className="flex justify-end">
          <button
            className="mt-4 inline-block rounded border border-green-600 bg-green-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-indigo-500"
            type="submit"
          >
            Gravar
          </button>
        </div>
      </form>
    </div>
  );
}
