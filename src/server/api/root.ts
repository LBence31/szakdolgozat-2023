import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { playlistRouter } from "./routers/playlist";
import { userOnPlaylistRouter } from "./routers/useronplaylist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  playlist: playlistRouter,
  userOnPlaylist: userOnPlaylistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
