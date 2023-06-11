import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "./server/api/root";
import { type } from "os";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type allCategoriesOutput = RouterOutputs["category"]["getAll"];
export type Categories = allCategoriesOutput[number];

type allCategoriesWithQuestionsOutput =
  RouterOutputs["category"]["getAllWithQuestions"];
export type CategoryWithQuestions = allCategoriesWithQuestionsOutput[number];

export const categoryName = z
  .string({
    required_error: "Campo obrigatório",
  })
  .min(1, "Por favor, insira um nome para a categoria")
  .max(50, "A categoria não pode ter mais de 50 caracteres");

export const categoryDescription = z
  .string()
  .max(200, "A descrição não pode ter mais de 200 caracteres");

type allQuestionsOutput = RouterOutputs["question"]["getAll"];
export type Questions = allQuestionsOutput[number];

export const questionName = z
  .string({
    required_error: "Campo obrigatório",
  })
  .min(1, "Por favor, insira um nome para a categoria")
  .max(50, "A categoria não pode ter mais de 50 caracteres");

export const questionDescription = z
  .string()
  .max(200, "A descrição não pode ter mais de 200 caracteres");

export const categoryId = z.string({
  required_error: "Campo obrigatório",
});
