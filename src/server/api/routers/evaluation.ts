import { string, z } from "zod";
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
            id: string().parse(id),
            name: string().parse(name),
            number: string().parse(number),
          }))
        : [],
      answers: Answer.map(({ id, score }) => ({
        id,
        score,
      })),
    }));
  }),

  getCount: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.evaluation.count();
    return count;
  }),

  getResume: protectedProcedure.query(async ({ ctx }) => {
    const evaluations = await ctx.prisma.evaluation.findMany({
      include: {
        Answer: {
          include: {
            question: true,
          },
        },
      },
    });

    return evaluations.map(({ id, Answer }) => ({
      id,
      answers: Answer.map(({ id, score, question }) => ({
        id,
        score,
        question: question.name,
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
          Answer: {
            select: {
              score: true,
              question: {
                select: {
                  name: true,
                },
              },
            },
          },
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
        answers: evaluation.Answer.map(({ score, question }) => ({
          score,
          question,
        })),
      };
    }),

  // get all answers by employee id include questions and also return the average score
  getByEmployeeId: protectedProcedure
    .input(employeeId)
    .query(async ({ ctx, input }) => {
      if (!input) {
        throw new Error("Input value is undefined or null");
      }

      const evaluation = await ctx.prisma.evaluation.findMany({
        where: {
          employeeId: input,
        },
        include: {
          Answer: {
            select: {
              score: true,
              question: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!evaluation) {
        throw new Error("Evaluation not found");
      }

      const totalAnswers = evaluation.reduce((acc, evaluation) => {
        return acc + evaluation.Answer.length;
      }, 0);

      const averageScore =
        evaluation.reduce((acc, evaluation) => {
          return (
            acc +
            evaluation.Answer.reduce((acc, answer) => {
              return acc + answer.score;
            }, 0)
          );
        }, 0) / totalAnswers;

      return {
        averageScore,
        evaluations: evaluation.map(({ id, Answer }) => ({
          id,
          answers: Answer.map(({ score, question }) => ({
            score,
            question,
          })),
        })),
      };
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
