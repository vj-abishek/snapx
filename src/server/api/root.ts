import { createTRPCRouter } from "./trpc";
import { S3Client } from "./routers/s3/init";
// import { exampleRouter } from "./routers/example";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  // example: exampleRouter,
  s3: S3Client,
});

// export type definition of API
export type AppRouter = typeof appRouter;
