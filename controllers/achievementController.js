const AchievementRepository = require("../repositories/achievementRepository");
const MentorRepository = require("../repositories/mentorRepository");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { uploadToS3 } = require('../s3-client.js');

dotenv.config();

class AchievementController {
  constructor() {
    this.achievementRepo = new AchievementRepository();
    this.mentorRepo = new MentorRepository();
  }

  // to handle achievement creation and file url saving in proof from s3
  addProofs = async (req, res) => {
    const { mentorId, userId, achievementId } = req.body;
    const files = req.files; // `req.files` will be an array of files

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    try {
      const achievement = await this.achievementRepo.getOne(achievementId);
      if (!achievement) {
        return res.status(404).json({ error: "Achievement not found" });
      }

      // Upload each file to S3 and get the URLs
      const fileURLs = await Promise.all(files.map(async (file, index) => {
        const key = `${mentorId}/${userId}/${achievementId}/file_${index + 1}.png`;
        return await uploadToS3(file.buffer, "bucket-private-site", key);
      }));

      // Update the achievement with file URLs
      achievement.proof = fileURLs;
      const savedAchievement = await achievement.save();

      res.status(200).json({ message: "Files uploaded successfully", savedAchievement });
    } catch (err) {
      console.error('Error uploading files:', err);
      res.status(500).json({ error: err.message });
    }
  };

  addAchievement = async (req, res) => {
    const {
      userId,
      name,
      date,
      type,
      description,
      location,
      is_Technical,
      mode,
      result,
      verificationStatus,
    } = req.body;

    try {
      const newAchievement = await this.achievementRepo.create({
        userId,
        name,
        date,
        type,
        description,
        location,
        is_Technical,
        mode,
        result,
        verificationStatus,
      });

      res.status(200).json({
        message: "Achievement added successfully",
        achievement: newAchievement,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error adding achievement" });
    }
  };

  deleteAchievement = async (req, res) => {
    try {
      const achievement = await this.achievementRepo.destroy(req.params.id);
      res.status(200).json({ message: "Achievement deleted successfully" });
    } catch (error) {
      console.log("Controller error: " + error);
      res.status(400).json({ message: error.message });
    }
  };

  getAchievements = async (req, res) => {
    const userId = req.params.userId;

    try {
      const achievements = await this.achievementRepo.getAchievementsByUserId(userId);
      res.status(200).json(achievements);
    } catch (error) {
      console.log("Controller error: " + error);
      res.status(400).json({ message: error.message });
    }
  };

  getAllAchievements = async (req, res) => {
    try {
      const achievements = await this.achievementRepo.getAllAchievements();
      res.status(200).json(achievements);
    } catch (error) {
      console.error("Controller error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getAchievementsInCSV = async (req, res) => {
    try {
      const achievements = await this.achievementRepo.getAchievementsByUserIdInCSV(req.params.userId);
      
      if (!achievements || achievements.length === 0) {
        throw new Error("No achievements found for the user");
      }

      // Extract headers
      const headers = Object.keys(achievements[0].dataValues);
      // Convert data to CSV format
      let csv = headers.join(",") + "\n";
      achievements.forEach((achievement) => {
        let row = headers.map((header) => achievement[header] || "").join(",");
        csv += row + "\n";
      });

      // Define the file path in the ../uploads directory
      const uploadsDir = path.join(__dirname, "../uploads");

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, "achievements.csv");
      const fileUrl = `http://localhost:3000/uploads/achievements.csv`;
      fs.writeFileSync(filePath, csv);

      res.status(200).json({ achievements, fileUrl });
    } catch (error) {
      console.error("Controller error:", error);
      res.status(400).json({ message: error.message });
    }
  };

  getAchievementsByMentorAndStatus = async (req, res) => {
    const { mentorId, status } = req.params;
    try {
      const mentor = await this.mentorRepo.getOne(mentorId);
      const validStatuses = ["pending", "accepted", "rejected"];

      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
      }

      const achievements = await this.achievementRepo.getAchievementsByUserIdsAndStatus(
        mentor.studentUserIds,
        status
      );

      res.status(200).json(achievements);
    } catch (error) {
      console.log("Controller error: " + error);
      res.status(400).json({ message: error.message });
    }
  };

  getAchievementsByMentorAndStatusInCSV = async (req, res) => {
    try {
      const { mentorId, status } = req.params;
      const mentor = await this.mentorRepo.getOne(mentorId);
      const validStatuses = ["pending", "accepted", "rejected"];

      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
      }

      const achievements = await this.achievementRepo.getAchievementsByUserIdsAndStatus(
        mentor.studentUserIds,
        status
      );

      if (!achievements || achievements.length === 0) {
        throw new Error("No achievements found for the given status");
      }

      // Extract headers for user and achievement info
      const userHeaders = Object.keys(achievements[0].userId.dataValues);
      const achievementHeaders = Object.keys(achievements[0].dataValues)
        .filter((key) => key !== "userId");

      let csv = "Student Information\n";
      csv += userHeaders.join(",") + "\n";
      let uniqueStudents = new Set();
      achievements.forEach((achievement) => {
        let userRow = userHeaders
          .map((header) => achievement.userId[header] || "")
          .join(",");
        if (!uniqueStudents.has(userRow)) {
          csv += userRow + "\n";
          uniqueStudents.add(userRow);
        }
      });

      csv += "\nAchievements\n";
      csv += achievementHeaders.join(",") + "\n";
      achievements.forEach((achievement) => {
        let achievementRow = achievementHeaders
          .map((header) => achievement[header] || "")
          .join(",");
        csv += achievementRow + "\n";
      });

      const uploadsDir = path.join(__dirname, "../uploads");

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, "student_achievements.csv");
      const fileUrl = `http://localhost:3000/uploads/student_achievements.csv`;
      fs.writeFileSync(filePath, csv);

      res.status(200).json({ achievements, fileUrl });
    } catch (error) {
      console.error("Controller error:", error);
      res.status(400).json({ message: error.message });
    }
  };

  getOneAchievement = async (req, res) => {
    try {
      const achievement = await this.achievementRepo.getOne(req.params.id);
      res.status(200).json(achievement);
    } catch (error) {
      console.log("Controller error: " + error);
      res.status(400).json({ message: error.message });
    }
  };

  // TODO: Create route, controller to handle "get achievement proof"

  getAchievementProof = async (req, res) => {
    // Controller code to retrieve and serve achievement proof
  };

  updateAchievement = async (req, res) => {
    try {
      const achievement = await this.achievementRepo.updateAchievement(
        req.params.id,
        req.body
      );
      res.status(200).json(achievement);
    } catch (error) {
      console.log("Controller error: " + error);
      res.status(400).json({ message: error.message });
    }
  };

  verifyAchievement = async (req, res) => {
    try {
      const { id, status } = req.params;
      console.log(id, status);

      const achievement = await this.achievementRepo.updateAchievement(id, {
        verificationStatus: status,
      });

      res.status(200).json(achievement);
    } catch (error) {
      console.log("Controller error: " + error);
      res.status(400).json({ message: error.message });
    }
  };
}

module.exports = new AchievementController();
