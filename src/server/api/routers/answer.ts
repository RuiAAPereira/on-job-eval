import { string, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

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
            id: string().parse(id),
            name: string().parse(name),
            description: string().parse(description),
          }))
        : [],
      evaluation: Array.isArray(evaluation)
        ? evaluation.map(({ id }) => ({
            id: string().parse(id),
          }))
        : [],
    }));
  }),

  getAverageScore: publicProcedure.query(async ({ ctx }) => {
    const answers = await ctx.prisma.answer.findMany({
      include: {
        question: true,
        evaluation: true,
      },
    });

    const averageScore =
      answers.reduce((acc, answer) => {
        return acc + answer.score;
      }, 0) / answers.length;

    return averageScore;
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
