const express = require("express");
const multer = require("multer");
// const upload = require("./middlewares/multerMiddleware.js")
const { uploadToS3 }= require('./s3-client.js');

const app = express();
const port = 3003;

const upload = multer({storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async(req, res)=>{
    const { mentorId, userId, name } = req.body;
    const file = req.file;


    if (!file){
        return res.json(400).json({error:'error 1'});
           }

        const key = `${mentorId}/${userId}/${name}.png`;
    try{
        const fileURL = await uploadToS3(file.buffer, "bucket-private-site", key);
        res.status(200).json({message: 'file success', fileURL});
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

app.listen(port, ()=> console.log("server running"));