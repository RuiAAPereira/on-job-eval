import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
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
