import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { categoryName, categoryDescription } from "@/types";

const categoryInputSchema = z.object({
  name: categoryName,
  description: categoryDescription,
});

export const categoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany();

    return categories.map(({ id, name, description }) => ({
      id,
      name,
      description,
    }));
  }),

  // get all categories grouped by question
  getAllGrouped: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      include: {
        Question: true,
      },
    });

    return categories.map(({ id, name, description, Question }) => ({
      id,
      name,
      description,
      questions: Question,
    }));
  }),

  create: protectedProcedure
    .input(categoryInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.category.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), ...categoryInputSchema.shape }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.category.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.question.deleteMany({
        where: {
          categoryId: input,
        },
      });
      return ctx.prisma.category.delete({
        where: {
          id: input,
        },
      });
    }),
});
