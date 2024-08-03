const express = require("express");
const router = express.Router();
const {
  validateVerificationStatus,
  validateAchievement,
} = require("../middlewares/validationMiddleware");

const achievementController = require("../controllers/achievementController");
const notificationController = require("../controllers/notificationController");
const requestController = require("../controllers/requestController");
// const s3Router = require('../s3exp'); // Import the S3 routes
const mentorController = require("../controllers/mentorController");
const userController = require("../controllers/userController");
// const { upload } = require("../middlewares/multerMiddleware");
const announcementRouter = require("./announcementRouter");

const upload = require('../middlewares/multerMiddleware');
// const uploadToS3 = require("../middlewares/s3AwsMiddleware");

// const upload = multer({storage: multer.memoryStorage() });
// Define the routes
router.get("/", (req, res) => {
  res.send("base api route");
});

router.get("/achievements/all", achievementController.getAllAchievements);
router.get("/achievements/:userId", achievementController.getAchievements);
router.get(
  "/achievements/:mentorId/:status",
  achievementController.getAchievementsByMentorAndStatus
);
router.get("/notifications/:userId", notificationController.getNotifications);
router.get("/requests/:mentorId", requestController.getRequests);

router.post("/mentor", mentorController.addMentor);
router.get("/mentors", mentorController.getAllMentors)
router.get("/mentor/:id", mentorController.getMentorById);
router.get("/mentor/:id/student", mentorController.getStudentsByMentorId);
router.post("/mentor/:id/student", mentorController.addStudentToMentor);
router.delete("/mentor/:id/student", mentorController.removeStudentFromMentor);
router.get(
  "/mentor/:id/achievements/:status",
  achievementController.getAchievementsByMentorAndStatus
);

router.post(
  "/add-achievement",
  validateAchievement,
  achievementController.addAchievement
);
router.post("/add-notification", notificationController.addNotification);
router.post("/add-request", requestController.addRequest);
router.put("/update-achievement/:id", achievementController.updateAchievement);

router.patch(
  "/verify-achievement/:id/:status",
  validateVerificationStatus,
  achievementController.verifyAchievement
);

router.delete(
  "/delete-achievement/:id",
  achievementController.deleteAchievement
);

router.post("/user/create", userController.addStudent);
router.get("/user/:id", userController.getStudentById);
router.get('/users', userController.getAllStudents)
router.delete("/delete-request/:id", requestController.deleteRequest);

router.get(
  "/achievement/:userId/csv",
  achievementController.getAchievementsInCSV
);
router.get(
  "/achievement/:mentorId/:status/csv",
  achievementController.getAchievementsByMentorAndStatusInCSV
);

router.use("/announcements", announcementRouter);
// router.use('/s3', s3Router);

router.post('/upload-files', upload.array('files'), achievementController.addProofs);

module.exports = router;
