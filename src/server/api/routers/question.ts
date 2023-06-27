import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { questionName, questionDescription, categoryId } from "@/types";

const questionInputSchema = z.object({
  name: questionName,
  description: questionDescription,
  categoryId: categoryId,
});

export const questionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const questions = await ctx.prisma.question.findMany();

    return questions.map(({ id, name, description }) => ({
      id,
      name,
      description,
    }));
  }),

  getQuestionsWithAverageAnswerScore: protectedProcedure.query(
    async ({ ctx }) => {
      const questions = await ctx.prisma.question.findMany({
        include: {
          Answer: {
            select: {
              score: true,
            },
          },
        },
      });

      return questions.map(({ id, name, description, Answer }) => ({
        id,
        name,
        description,
        averageScore:
          Answer.reduce((acc, { score }) => acc + score, 0) / Answer.length,
        anwserCount: Answer.length,
      }));
    }
  ),

  getCount: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.question.count();

    return count;
  }),

  create: protectedProcedure
    .input(questionInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.question.create({
        data: {
          name: input.name,
          description: input.description,
          category: {
            connect: {
              id: input.categoryId,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), ...questionInputSchema.shape }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.question.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          category: {
            connect: {
              id: input.categoryId,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.question.delete({
        where: {
          id: input,
        },
      });
    }),
});
