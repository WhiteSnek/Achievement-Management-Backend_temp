// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const axios = require('axios');
// const { generateUploadURL, generateDownloadURL } = require('./s3Service'); 
// const router = express.Router();
// const upload = multer({dest: 'uploads/'});

// // app.use(express.json());

// router.post('/upload', upload.single('image'), async (req, res) => {
//   const { mentorId, studentId } = req.body;
//   const fileContent = fs.readFileSync(req.file.path);
//   const fileName = req.file.originalname;

//   try {
//     const uploadURL = await generateUploadURL(mentorId, studentId, fileName);
//     // res.send({ success: true, url });
    
//     // upload files to s3 using pre-signed url
//     await axios.put(uploadURL, fileContent,{
//       headers:{
//         'Content-Type': 'image/png'
//       }
//     });
//     res.send({success: true, message: 'File uploaded Succesfully'});
//   } catch (error) {
//     res.status(500).send({ success: false, message: error.message });
//   } finally{
//     fs.unlinkSync(req.file.path);
//   }
// });

// router.get('/image', async (req, res) => {
//   const { mentorId, studentId, fileName } = req.query;

//   try {
//     const downloadURL = await generateDownloadURL(mentorId, studentId, fileName);
//     // res.send({ success: true, url });
//     // url aane ke baad idhar hi download
//     console.log(downloadURL)

//     const response = await axios.get(downloadURL, {responseType: 'arraybuffer'});

//     res.set('Content-Type', response.headers['content-type']);
//     res.send(response.data);
    
//   } catch (error) {
//     res.status(500).send({ success: false, message: error.message });
//   }
// });

// module.exports = router;
