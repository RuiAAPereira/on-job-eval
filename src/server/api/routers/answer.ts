import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const answerInputSchema = z.object({
  score: z.number(),
  questionId: z.string(),
  evaluationId: z.string(),
});

export const answerRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const answers = await ctx.prisma.answer.findMany({
      include: {
        question: true,
        evaluation: true,
      },
    });

    return answers.map(({ id, score, question, evaluation }) => ({
      id,
      score,
      question: Array.isArray(question)
        ? question.map(({ id, name, description }) => ({
            id,
            name,
            description,
          }))
        : [],
      evaluation: Array.isArray(evaluation)
        ? evaluation.map(({ id }) => ({
            id,
          }))
        : [],
    }));
  }),

  create: protectedProcedure
    .input(answerInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.answer.create({
        data: {
          questionId: input.questionId,
          evaluationId: input.evaluationId,
          score: input.score,
        },
      });
    }),
});

