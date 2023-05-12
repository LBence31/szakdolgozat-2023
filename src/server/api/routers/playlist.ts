import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const playlistRouter = createTRPCRouter({
  addPlaylist: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        playlistId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.playlist.upsert({
        where: {
          id: input.playlistId,
        },
        update: {},
        create: {
          id: input.playlistId,
          userId: input.userId,
        },
      });
    }),

  getUsePlaylists: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.playlist.findMany({
        where: {
          userId: input.userId,
        },
        select: {
          id: true,
        },
      });
    }),
});