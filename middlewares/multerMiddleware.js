const multer = require("multer");

// configuring the multer storage
// taki frontend se req.file le paye

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
