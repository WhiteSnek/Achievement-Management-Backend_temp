require("dotenv").config();
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

console.log(process.env.AWS_SECRET_ACCESS_KEY)
console.log(process.env.AWS_ACCESS_KEY_ID)
console.log(process.env.AWS_BUCKET_NAME)
console.log(process.env.AWS_REGION)
const uploadToS3 = async (req, res, next) => {
  const { mentorId, userId, name, date } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "File is required" });
  }
  const parsedDate = new Date(date);
  const sanitizedFileName = name.replace(/\s+/g, "-");
  const sanitizedDate = parsedDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
  // const key = `${mentorId}/${userId}/${sanitizedFileName}_${sanitizedDate}.png`;
  const key = '12345/05120802722/dish-washing'
  //   console.log(key)
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    console.log(data)
    // req.fileUrl = data.Location;
    res.status(200).json({ message: "file success", fileURL });
    next();
  } catch (err) {
    console.error('S3 Upload Error:', err);
    res.status(500).json({ error: "Error uploading file to S3 bucket" });
  }
};

module.exports = uploadToS3;
