import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from './config'

const s3Client = new S3Client({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

async function getObjectURL(key){
    const command = new GetObjectCommand({
        Bucket: config.bucketName,
        Key:key
    });
    const url = getSignedUrl(s3Client, command);
    return url;
}

async function uploadImage(key, body) {
  console.log("SUBIENDO");
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: body,
    ContentType: 'image/png', // Adjust the content type accordingly
  });

  try {
    const response = await s3Client.send(command);
    console.log('Image uploaded successfully:', response);
    return response;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }

}

export const s3methods = {
  getObjectURL,
  uploadImage
}
