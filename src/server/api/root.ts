import { createTRPCRouter } from "@/server/api/trpc";
import { categoryRouter } from "@/server/api/routers/category";
import { questionRouter } from "@/server/api/routers/question";
import { evaluationRouter } from "@/server/api/routers/evaluation";
import { employeeRouter } from "@/server/api/routers/employee";
import { answerRouter } from "@/server/api/routers/answer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  question: questionRouter,
  evaluation: evaluationRouter,
  employee: employeeRouter,
  answer: answerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
