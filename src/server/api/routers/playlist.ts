/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

interface dataArray {
  id: string;
  name: string;
  userId: string;
}

export const playlistRouter = createTRPCRouter({
  addPlaylist: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        playlistIds: z.array(z.string()),
        playlistNames: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      const dataArray: dataArray[] = input.playlistIds.map((id, i) => {
        return {
          id: id,
          name: input.playlistNames[i]!,
          userId: input.userId,
        };
      });
      return ctx.prisma.playlist.createMany({
        data: dataArray,
        skipDuplicates: true,
      });
    }),

  getUserPlaylists: protectedProcedure
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

  getOtherUsersPlaylists: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.playlist.findMany({
        where: {
          userId: {
            not: input.userId,
          },
          user: {
            email: {
              not: "spotify@spotify.com",
            },
          },
        },
      });
    }),
});
