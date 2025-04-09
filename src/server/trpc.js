import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { prisma } from "./db.js";
import { io } from "./socket.js";

export const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Middleware to check authentication
  if (!ctx?.userId) throw new Error("Not authenticated");

  const user = await prisma.user.findFirst({
    where: { id: ctx.userId ?? null },
  });

  if (!user) throw new Error("User not found");

  return next({ ctx: { ...ctx, user } });

  // return next({ ctx });
});

// Create tRPC router
export const appRouter = router({
  // Users router
  users: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const user = await prisma.user.create({
          data: { name: input.name },
        });
        return user;
      }),
  }),

  // Messages router
  messages: router({
    list: privateProcedure
      .input(
        z.object({
          page: z.number().default(1),
          limit: z.number().default(30),
        }),
      )
      .query(async ({ input, ctx }) => {
        const { page, limit } = input;
        const offset = (page - 1) * limit;

        const messages = await prisma.message.findMany({
          take: limit,
          skip: offset,
          include: { user: true },
          orderBy: { createdAt: "desc" },
        });

        const totalMessages = await prisma.message.count();

        return {
          messages: messages.reverse(),
          hasMore: page * limit < totalMessages,
          total: totalMessages,
        };
      }),

    create: privateProcedure
      .input(
        z.object({
          content: z.string(),
          userId: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const message = await prisma.message.create({
          // data: { content: input.content, userId: ctx.userId },
          data: { content: input.content, userId: ctx.user.id },
          // data: { content: input.content, userId: input.userId },
          include: { user: true },
        });

        io.emit("message", message);
        return message;
      }),
  }),
});
