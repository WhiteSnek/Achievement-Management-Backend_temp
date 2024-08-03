const express = require("express");
const sequelize = require('./db/index')
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./routes/router");
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const uploadsDir = path.join(__dirname, './uploads');
app.use('/uploads', express.static(uploadsDir));

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server is live !");
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running on port ${PORT}`);
});

