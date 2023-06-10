import type { inferRouterOutputs} from "@trpc/server"
import { z } from "zod";
import type { AppRouter } from "./server/api/root";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type allCategoriessOutput = RouterOutputs["category"]["getAll"];

export type Category = allCategoriessOutput[number];

export const categoryName = z
  .string({
    required_error: "Campo obrigatório",
  })
  .min(1, "Por favor, insira um nome para a categoria")
  .max(50, "A categoria não pode ter mais de 50 caracteres");

  export const categoryDescription = z
  .string()
  .max(200, "A descrição não pode ter mais de 200 caracteres");