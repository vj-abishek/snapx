/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const videoRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        videoUid: z.string().optional(),
        screenUid: z.string().optional(),
        duration: z.number(),
        linkId: z.string().optional(),
        description: z.string().optional(),
        thumbnail: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.video.create({
        data: {
          id: input.id,
          title: input.title,
          videoUid: input.videoUid || "",
          screenUid: input.screenUid || "",
          userId: ctx.session.user.id,
          duration: input.duration,
          instantLinkId: input?.linkId ?? null,
          description: input.description ?? null,
          thumbnail: input.thumbnail ?? "",
        },
      });
      await ctx.prisma.sharedWith.create({
        data: {
          emailId: ctx.session.user.email,
          role: "OWNER",
          videoId: input.id,
        },
      });
    }),

  addResponse: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        videoUid: z.string().optional(),
        screenUid: z.string().optional(),
        duration: z.number(),
        linkId: z.string(),
        description: z.string().optional(),
        thumbnail: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma
        .$transaction([
          ctx.prisma.video.create({
            data: {
              id: input.id,
              title: input.title,
              videoUid: input.videoUid || "",
              screenUid: input.screenUid || "",
              userId: ctx.session.user.id,
              duration: input.duration,
              instantLinkId: input?.linkId ?? null,
              description: input.description ?? null,
              thumbnail: input.thumbnail ?? "",
            },
          }),
          ctx.prisma.instantLink.update({
            where: {
              linkId: input.linkId,
            },
            data: {
              updatedAt: new Date(),
            },
          }),
        ])
        .catch(console.error);
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(({ input, ctx }) => {
      if (!input.id) {
        return null;
      }
      return ctx.prisma.video.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: true,
        },
      });
    }),

  getThumbnail: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { data } = await supabase.storage
        .from("thumbs")
        .createSignedUrl(`${input.videoId}.png`, 60 * 60 * 24 * 7);

      if (data) {
        return data;
      }
      return null;
    }),

  getURL: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.id) {
        return null;
      }
      const { data } = await supabase.storage
        .from("videos")
        .createSignedUrl(input.id, 60 * 60 * 24 * 7);

      if (!data) {
        return null;
      }
      return data;
    }),

  createLink: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        expiresAt: z.string(),
        linkId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.instantLink.create({
        data: {
          title: input.title,
          description: input?.description,
          userId: ctx.session.user.id,
          expiresAt: input.expiresAt,
          linkId: input.linkId,
        },
      });
    }),

  getLink: publicProcedure
    .input(
      z.object({
        linkId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.linkId) {
        return null;
      }

      return ctx.prisma.instantLink.findUnique({
        where: {
          linkId: input.linkId,
        },
        include: {
          user: true,
        },
      });
    }),

  getCurrentUserVideos: protectedProcedure
    .input(
      z.object({
        linkId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.linkId) {
        return ctx.prisma.video.findMany({
          where: {
            instantLinkId: input.linkId,
          },
          include: {
            user: true,
          },
        });
      }

      return ctx.prisma.video.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getLinkdedVideos: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.instantLink.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        _count: {
          select: {
            video: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  access: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sharedWith.findFirst({
        where: {
          videoId: input.videoId,
          emailId: ctx.session.user.email,
        },
        include: {
          user: true,
        },
      });
    }),
});
