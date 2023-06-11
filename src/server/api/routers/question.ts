import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";


export const questionRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      const questions = await ctx.prisma.question.findMany();
  
      return questions.map(({ id, text, questionText }) => ({
        id,
        text,
        questionText,
      }));
    }),



  });