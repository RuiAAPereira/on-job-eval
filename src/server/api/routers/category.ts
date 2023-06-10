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

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.category.delete({
        where: {
          id: input,
        },
      });
    }),
});
