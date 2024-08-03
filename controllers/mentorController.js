const mentorRepo = require("../repositories/mentorRepository");
const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL, // Update with your Redis server URL if different
});
redisClient.connect().catch(console.error);

// TODO: Add validation to the request body in methods that require it
class mentorController {
  constructor() {
    this.mentor = new mentorRepo();
  }

  // Add a new mentor
  addMentor = async (req, res) => {
    try {
      const mentor = await this.mentor.addMentor(req.body);
      res.status(201).json(mentor);
    } catch (error) {
      console.log("controller error : " + error);
      res.status(400).json({ message: error.message });
    }
  };

  // Get a mentor by ID
  getMentorById = async (req, res) => {
    const mentorId = req.params.id;
    // Check cache first
    const cacheKey = `mentor:${mentorId}`;

    try {
      const cachedAchievements = await redisClient.get(cacheKey);

      if (cachedAchievements) {
        return res.status(200).json(JSON.parse(cachedAchievements));
      }

      const mentor = await this.mentor.getMentorById(mentorId);
      await redisClient.set(cacheKey, JSON.stringify(mentor), "EX", 3600);
      res.status(200).json(mentor);
    } catch (error) {
      console.log("controller error : " + error);
      res.status(400).json({ message: error.message });
    }
  };
  // Get all students for a specific mentor
  getStudentsByMentorId = async (req, res) => {
    const mentorId = req.params.id;
    const cacheKey = `mentor:students:${mentorId}`;

    try {
      // Check cache first
      const cachedStudents = await redisClient.get(cacheKey);
      if (cachedStudents) {
        return res.status(200).json(JSON.parse(cachedStudents));
      }

      // Fetch from database if not in cache
      const students = await this.mentor.getStudentsByMentorId(mentorId);

      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(students), "EX", 3600);

      res.status(200).json(students);
    } catch (error) {
      console.log("controller error : " + error);
      res.status(400).json({ message: error.message });
    }
  };

  // Add a student to a mentor
  addStudentToMentor = async (req, res) => {
    try {
      const mentor = await this.mentor.addStudentToMentor(
        req.params.id,
        req.body.studentUserId
      );

      // Invalidate cache for this mentor
      const cacheKey = `mentor:${req.params.id}`;
      // await redisClient.del(cacheKey);

      res.status(200).json(mentor);
    } catch (error) {
      console.log("controller error : " + error);
      res.status(400).json({ message: error.message });
    }
  };

  // Remove a student from a mentor
  removeStudentFromMentor = async (req, res) => {
    try {
      const mentor = await this.mentor.removeStudentFromMentor(
        req.params.id,
        req.body.studentUserId
      );

      // Invalidate cache for this mentor
      const cacheKey = `mentor:${req.params.id}`;
      // await redisClient.del(cacheKey);

      res.status(200).json(mentor);
    } catch (error) {
      console.log("controller error : " + error);
      res.status(400).json({ message: error.message });
    }
  };

  getAllMentors = async (req, res) => {
    try {
      const mentors = await this.mentor.getAllMentors();
      res.status(200).json(mentors);
    } catch (error) {
      console.log("controller error : " + error);
      res.status(400).json({ message: error.message });
    }
  };
}

module.exports = new mentorController();
