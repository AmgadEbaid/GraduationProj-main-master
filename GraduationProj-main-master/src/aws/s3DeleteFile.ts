import { s3 } from 'src/aws/s3.client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export const deleteFileFromS3 = async (fileKey) => {
  if (!fileKey) {
    console.log('No file key provided');
    return false;
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log(`File ${fileKey} deleted successfully`);
    return true;
  } catch (err) {
    console.log('Error deleting file:', fileKey);
    return false;
  }
};
