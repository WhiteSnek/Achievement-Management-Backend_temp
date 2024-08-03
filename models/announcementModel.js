const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Achievement",
  },
  // message: {
  //   type: String,
  //   required: false,
  // },
  created_at: {
    type: Date,
    default: Date.now,
    expires: 86400
  }

});

module.exports = mongoose.model("Announcement", announcementSchema);
