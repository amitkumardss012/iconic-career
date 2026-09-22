export const ENV = {
  JWT_SECRET: process.env.JWT_SECRET,

  // Active Storage Provider: "CLOUDINARY" | "AWS_S3" | "AZURE_BLOB" | "LOCAL"
  STORAGE_PROVIDER: (process.env.STORAGE_PROVIDER || "CLOUDINARY") as
    "CLOUDINARY" | "AWS_S3" | "AZURE_BLOB" | "LOCAL",

  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
  CLOUD_FOLDER: process.env.CLOUD_FOLDER,

  // AWS S3 Credentials
  aws_s3_bucket: process.env.AWS_S3_BUCKET,
  aws_region: process.env.AWS_REGION || "us-east-1",
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  
  // Razarpay 
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

  NODE_ENV: process.env.NODE_ENV,
}

export default ENV