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

    const employee = ctx.prisma.employee.findFirst({
      where: {
        id: input,
      },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
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
