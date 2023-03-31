import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "src/env.mjs";
import { nanoid } from "nanoid";

class S3 {
  private s3: S3Client;
  private bucketName = "recordr-develop";
  private ALLOWED_FORMATS = ["jpeg", "webp", "jpg", "png", "webm"];

  constructor() {
    this.s3 = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: env.AWS_S3_ACCESS_KEY,
        secretAccessKey: env.AWS_S3_SECRET_KEY,
      },
    });
  }

  async init(format: string, contentType: string) {
    // if (!this.ALLOWED_FORMATS.includes(format)) {
    //   throw new Error("Format not allowed");
    // }

    // const randomID = nanoid();
    // const Key = `${Date.now()}.${format}`;
    // console.log(Key);

    console.log(format);

    const params = {
      Bucket: this.bucketName,
      Key: format,
      ContentType: contentType,
    };

    const MPcommand = new CreateMultipartUploadCommand(params);
    const response = await this.s3.send(MPcommand);

    const command = new UploadPartCommand({
      ...params,
      UploadId: response.UploadId,
      PartNumber: 1,
    });

    console.log(command);

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    console.log(signedUrl);
    return {
      signedUrl,
      Key: format,
      uploadId: response.UploadId,
    };
  }

  // get the link for upload parts
  async getUploadPartLink(Key: string, uploadId: string, partNumber: number) {
    const params = {
      Bucket: this.bucketName,
      Key,
      UploadId: uploadId,
      PartNumber: partNumber,
    };

    const command = new UploadPartCommand(params);

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    return signedUrl;
  }

  // complete the multipart upload
  async completeMultipartUpload(
    Key: string,
    uploadId: string,
    Parts: { ETag: string; PartNumber: number }[]
  ) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts,
        },
      };

      const command = new CompleteMultipartUploadCommand(params);

      const response = await this.s3.send(command);
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new S3();
