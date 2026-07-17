import { createRouter, publicQuery } from "./middleware";
import { blogRouter } from "./blogRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;
