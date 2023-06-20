import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import Answer from "./Answer";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

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

  const handleSubmit = async () => {
    try {
      addEvaluation({
        employeeId: props.employeeId,
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar avaliação");
    }
  };

  const router = useRouter();

  const { mutate: addEvaluation } = api.evaluation.create.useMutation({
    onSuccess: (data) => {
      const answersArray = Object.entries(answers).map(
        ([questionId, score]) => ({
          questionId,
          score,
        })
      );

      answersArray.forEach((answer) => {
        addAnswer({
          evaluationId: data.id,
          questionId: answer.questionId,
          score: answer.score,
        });
      });

      router.push("/evaluation/details/" + data.id);
    },
  });

  const { mutate: addAnswer } = api.answer.create.useMutation();

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {categories && categories.length ? (
        categories?.map((c) => {
          return (
            <div key={c.id}>
              <h2>{c.name}</h2>

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
      <div>
        <div>
          <button type="submit">Gravar</button>
        </div>
      </div>
    </form>
  );
}