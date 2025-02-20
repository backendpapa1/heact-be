import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand,
  } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  import fs from "fs";
  import path from "path";
  import dotenv from "dotenv";
  
  dotenv.config();
  
  export class MinioS3 {
    private s3Client: S3Client;
    private bucketName: string;
  
    constructor() {
      this.s3Client = new S3Client({
        region: process.env.MINIO_REGION!, 
        endpoint: process.env.MINIO_ENDPOINT!, // MinIO URL
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY!,
          secretAccessKey: process.env.MINIO_SECRET_KEY!,
        },
        forcePathStyle: true, // Required for MinIO
      });
  
      this.bucketName = process.env.BUCKET_NAME!;
    }
  
    /**
     * Uploads a file to MinIO S3
     * @param filePath - Local file path
     * @param key - Destination key in S3
     */
    async uploadFile(file: Buffer, key: string,mimetype: string): Promise<{status: boolean;data: any | null;error: any | null}> {
      try {
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file,
          ContentType: mimetype,
        });
  
        const data = await this.s3Client.send(command);
        return {status:true,data,error:null};
      } catch (error) {
        throw new Error(`Upload failed: ${(error as Error).message}`);
      }
    }
  
    /**
     * Retrieves a signed URL for downloading a file from MinIO
     * @param key - File key in S3
     */
    async getFileUrl(key: string): Promise<string> {
      try {
        const command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
  
        return await getSignedUrl(this.s3Client, command, { expiresIn: 360000 }); // 1-hour expiry
      } catch (error) {
        throw new Error(`Failed to generate URL: ${(error as Error).message}`);
      }
    }
  
    /**
     * Lists all files in the bucket
     */
    async listFiles(): Promise<string[]> {
      try {
        const command = new ListObjectsV2Command({
          Bucket: this.bucketName,
        });
  
        const response = await this.s3Client.send(command);
        return response.Contents?.map((item) => item.Key!) || [];
      } catch (error) {
        throw new Error(`Failed to list files: ${(error as Error).message}`);
      }
    }
  
    /**
     * Deletes a file from MinIO S3
     * @param key - File key in S3
     */
    async deleteFile(key: string): Promise<string> {
      try {
        const command = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
  
        await this.s3Client.send(command);
        return `File deleted: ${key}`;
      } catch (error) {
        throw new Error(`Failed to delete file: ${(error as Error).message}`);
      }
    }
  
    /**
     * Determines the content type based on file extension
     */
    private getContentType(filePath: string): string {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes: { [key: string]: string } = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".pdf": "application/pdf",
        ".txt": "text/plain",
        ".mp4": "video/mp4",
      };
  
      return mimeTypes[ext] || "application/octet-stream";
    }
  }
  