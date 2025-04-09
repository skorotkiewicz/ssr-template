import { createTRPCClient, httpBatchLink } from "@trpc/client";

// Create tRPC client
export const api = createTRPCClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});
