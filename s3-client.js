const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3Client = new S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY},
});

console.log(process.env.AWS_ACCESS_KEY_ID)
console.log(process.env.AWS_SECRET_ACCESS_KEY)

const uploadToS3 = async (fileContent, bucketName,key)=>{
    const params = {
        Bucket : "bucket-private-site",
        Key: key,
        Body: fileContent,
        ACL: 'public-read',
        ContentType: fileContent.mimetype,
    };
    try{
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);
        console.log(data)
        const fileUrl = `https://bucket-private-site.s3.eu-north-1.amazonaws.com/${key}`
        return fileUrl
    } catch(err){
        console.error("error uploading", err);
        throw new Error("error,0 upload krne mein")
    }
};
module.exports = { uploadToS3 };
