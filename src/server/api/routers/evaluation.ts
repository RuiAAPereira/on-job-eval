import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { employeeId } from "@/types";

const evaluationInputSchema = z.object({
  employeeId: employeeId,
});

export const evaluationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const evaluations = await ctx.prisma.evaluation.findMany({
      include: {
        employee: true,
        Answer: true,
      },
    });

    return evaluations.map(({ id, employee, Answer }) => ({
      id,
      employee: Array.isArray(employee)
        ? employee.map(({ id, name, number }) => ({
            id,
            name,
            number,
          }))
        : [],
      answers: Answer.map(({ id, score }) => ({
        id,
        score,
      })),
    }));
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!input) {
        throw new Error("Input value is undefined or null");
      }

      const evaluation = await ctx.prisma.evaluation.findUnique({
        where: {
          id: input,
        },
        include: {
          employee: true,
          Answer: true,
        },
      });

      if (!evaluation) {
        throw new Error("Evaluation not found");
      }

      return {
        id: evaluation.id,
        employee: {
          id: evaluation.employee.id,
          name: evaluation.employee.name,
          number: evaluation.employee.number,
        },
        answers: evaluation.Answer.map(({ id, score }) => ({
          id,
          score,
        })),
      };
    }),

  getByEmployeeId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!input) {
        throw new Error("Input value is undefined or null");
      }

      const evaluations = await ctx.prisma.evaluation.findMany({
        where: {
          employeeId: input,
        },
      });

      return evaluations.map(({ id, employeeId }) => ({ id, employeeId }));
    }),

  create: protectedProcedure
    .input(evaluationInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.evaluation.create({
        data: {
          employee: {
            connect: {
              id: input.employeeId,
            },
          },
        },
      });
    }),
});
