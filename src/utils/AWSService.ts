import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

class AWSService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      region: 'us-east-1',
      credentials: {
        accessKeyId: "" ,
        secretAccessKey: "" ,
      },
    });
  }

  upload(filename: string, blob: Buffer, userId: string): Promise<{ publicUrl: string; uploaded: boolean; Location: string; Key: string; Bucket: string }> {
    return new Promise((resolve, reject) => {
      console.log(process.env.BUCKET_NAME);
      console.log(process.env.ACCESS_KEY,'otrher')
      
      const uploadData = {
        Bucket: "lovejollof-asset",
        Key: `${userId}/${filename}`,
        Body: blob,
        ACL: 'public-read', // This makes the uploaded object publicly readable
      };

      this.s3.upload(uploadData).promise()
        .then((uploadedData) => {
          // Construct the public URL
          const publicUrl = `https://lovejollof-asset.s3.amazonaws.com/${userId}/${filename}`;
          resolve({
            ...uploadedData,
            publicUrl,
            uploaded: true,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default AWSService;
