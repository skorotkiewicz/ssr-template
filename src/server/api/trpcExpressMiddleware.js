import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../trpc.js';

export const trpcExpressMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: () => ({}),
});