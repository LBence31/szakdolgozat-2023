import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userOnPlaylistRouter = createTRPCRouter({
  followPlaylist: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        playlistId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.usersOnPlaylists.create({
        data: {
          userId: input.userId,
          playlistId: input.playlistId,
        },
      });
    }),

  unFollowPlaylist: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        playlistId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.usersOnPlaylists.delete({
        where: {
          userId_playlistId: {
            userId: input.userId,
            playlistId: input.playlistId,
          },
        },
      });
    }),

  findPlaylist: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        playlistId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.usersOnPlaylists.findMany({
        where: {
          userId: input.userId,
          playlistId: input.playlistId,
        },
        select: {
          playlistId: true,
        },
      });
    }),

  getUserFollowedPlaylistDetails: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.usersOnPlaylists.findMany({
        where: {
          userId: input.userId,
        },
        select: {
          playlist: true,
        },
      });
    }),
});
