import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { employeeName, employeeNumber } from "@/types";

const employeeInputSchema = z.object({
  name: employeeName,
  number: employeeNumber,
});

export const employeeRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const employees = await ctx.prisma.employee.findMany();

    return employees.map(({ id, name, number }) => ({
      id,
      name,
      number,
    }));
  }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (!input) {
      throw new Error("Input value is undefined or null");
    }

    const employee = await ctx.prisma.employee.findFirst({
      where: {
        id: input,
      },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }),

  getCount: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.employee.count();
    return count;
  }),

  getWithoutEvaluation: protectedProcedure.query(async ({ ctx }) => {
    const employees = await ctx.prisma.employee.findMany({
      where: {
        Evaluation: {
          none: {},
        },
      },
    });

    return employees.map(({ id, name, number }) => ({
      id,
      name,
      number,
    }));
  }),

  employeePaginationWithSearch: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number(),
        search: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const employees = await ctx.prisma.employee.findMany({
        where: {
          name: { contains: input.search },
        },
        skip: input.skip,
        take: input.take,
      });

      const totalEmployees = await ctx.prisma.employee.count({
        where: {
          name: { contains: input.search },
        },
      });

      const totalPages = Math.ceil(totalEmployees / input.take);
      const currentPage = Math.floor(input.skip / input.take) + 1;

      return {
        employees: employees.map(({ id, name, number }) => ({
          id,
          name,
          number,
        })),
        totalPages,
        currentPage,
        totalEmployees,
      };
    }),

  create: protectedProcedure
    .input(employeeInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.employee.create({
        data: {
          name: input.name,
          number: input.number,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), ...employeeInputSchema.shape }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.employee.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          number: input.number,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.evaluation.deleteMany({
        where: {
          employeeId: input,
        },
      });
      return ctx.prisma.employee.delete({
        where: {
          id: input,
        },
      });
    }),
});
