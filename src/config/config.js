import {config} from "dotenv"

config()

export default {
    port : process.env.PORT || 3000,
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    user: process.env.USER || "",
    password: process.env.PASSWORD || "",
    accessKeyId: process.env.MY_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.MY_SECRET_ACCESS_KEY || "",
    region: process.env.S3_REGION || "",
    bucketName: process.env.BUCKET_NAME || ""
}