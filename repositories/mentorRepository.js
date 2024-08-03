const Mentor = require("../models/mentorModel");
const crudRepo = require("./crud");
const redisClient = require('../redis/redisClient');

class mentorRepository extends crudRepo {
  constructor() {
    super(Mentor);
  }

  addMentor = async (data) => {
    try {
      const mentor = await this.model.create(data);
      return mentor;
    } catch (error) {
      console.log("repository error : " + error);
      throw error;
    }
  };

  getMentorById = async (mentorId) => {
    try {
      const cacheKey = `mentor:${mentorId}`;

      const cachedMentor = await redisClient.get(cacheKey);
      if (cachedMentor) {
        return JSON.parse(cachedMentor);
      }
  
      const mentor = await this.model.findById(mentorId).populate('studentUserIds');
      if (!mentor) {
        throw new Error("Mentor not found");
      }
  
      await redisClient.set(cacheKey, JSON.stringify(mentor), 'EX', 3600);
  
      return mentor;
    } catch (error) {
      console.log("repository error : " + error);
      throw error;
    }
  };
  
  getAllMentors = async () => {
    try {
      const cacheKey = 'mentors:all';
  
      const cachedMentors = await redisClient.get(cacheKey);
      if (cachedMentors) {
        return JSON.parse(cachedMentors);
      }

      const mentors = await this.model.find().populate('studentUserIds');

      await redisClient.set(cacheKey, JSON.stringify(mentors), 'EX', 3600);
  
      return mentors;
    } catch (error) {
      console.log("repository error : " + error);
      throw error;
    }
  };

  getStudentsByMentorId = async (mentorId) => {
    try {
      const cacheKey = `mentor:students:${mentorId}`;
  
      const cachedStudents = await redisClient.get(cacheKey);
      if (cachedStudents) {
        return JSON.parse(cachedStudents);
      }

      const students = await this.model.findById(mentorId).populate('studentUserIds').select('studentUserIds');

      await redisClient.set(cacheKey, JSON.stringify(students), 'EX', 3600);
  
      return students;
    } catch (error) {
      console.log("repository error : " + error);
      throw error;
    }
  };
  


  addStudentToMentor = async (mentorId, studentUserId) => {
    try {
      const mentor = await this.getMentorById(mentorId);

      mentor.studentUserIds.push(studentUserId);

      await mentor.save();

      // Invalidate cache for this mentor
      // const cacheKey = `mentor:${mentorId}`;
      // await redisClient.del(cacheKey);

      return mentor;
    } catch (error) {
      console.log("repository error : " + error);
      throw error;
    }
  };

  removeStudentFromMentor = async (mentorId, studentUserId) => {
    try {
      const mentor = await this.getMentorById(mentorId);

      if (!mentor) {
        throw new Error("Mentor not found");
      }

      mentor.studentUserIds = mentor.studentUserIds.filter(
        (id) => id.toString() !== studentUserId.toString()
      );

      await mentor.save();

      // // Invalidate cache for this mentor
      // const cacheKey = `mentor:${mentorId}`;
      // await redisClient.del(cacheKey);

      return mentor;
    } catch (error) {
      console.log("repository error : " + error);
      throw error;
    }
  };
}

module.exports = mentorRepository;
