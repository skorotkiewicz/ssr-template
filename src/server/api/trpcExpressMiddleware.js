import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../trpc.js";

export const trpcExpressMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: ({ req }) => {
    // Extract userId from cookies
    const userId = req.headers.cookie
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("userId="))
      ?.split("=")[1];

    if (userId) return { userId };
  },
});
