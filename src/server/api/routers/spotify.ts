import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import spotifyApi from "~/lib/spotify";

export const spotifyRouter = createTRPCRouter({
  getPlaylist: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(({ input }) => {
      return spotifyApi.getPlaylist(input.id);
    }),
});
