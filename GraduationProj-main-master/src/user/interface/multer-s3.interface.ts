// types/multer-s3-file.interface.ts
export interface MulterS3File extends Express.Multer.File {
  location: string; // The S3 URL
  key: string; // The path/key in the S3 bucket
  bucket: string;
}
