import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from './src/config/config'

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
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: body,
    ContentType: 'image/png', // Adjust the content type accordingly
  });

  return response = await s3Client.send(command);

}

async function init(){
  console.log('URL for Imagen4.png', await getObjectURL("Imagen4.png"));

}

init();