import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserPlaylistIDs: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          ownedPlaylists: {
            select: {
              id: true,
            },
          },
        },
      });
    }),

  getSpotifyUserID: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: {
        email: "spotify@spotify.com",
      },
    });
  }),
});
