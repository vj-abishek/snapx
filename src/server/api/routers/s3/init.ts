import s3 from "@/lib/s3";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const S3Client = createTRPCRouter({
  init: protectedProcedure
    .input(
      z.object({
        format: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const s3init = await s3.init(input.format, input.contentType);

        return {
          signedUrl: s3init.signedUrl,
          key: s3init.Key,
          uploadId: s3init.uploadId,
        };
      } catch (err) {
        return {
          error: err,
        };
      }
    }),

  uploadPart: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        uploadId: z.string(),
        partNumber: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const s3uploadPart = await s3.getUploadPartLink(
          input.key,
          input.uploadId,
          input.partNumber
        );

        return {
          signedUrl: s3uploadPart,
        };
      } catch (err) {
        return {
          error: err,
        };
      }
    }),

  complete: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        uploadId: z.string(),
        parts: z.array(
          z.object({
            ETag: z.string(),
            PartNumber: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const s3complete = await s3.completeMultipartUpload(
          input.key,
          input.uploadId,
          input.parts
        );

        return {
          complete: s3complete,
        };
      } catch (err) {
        return {
          error: err,
        };
      }
    }),
});
