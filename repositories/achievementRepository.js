const{ Achievement }= require("../models");
const redisClient = require('../redis/redisClient');
const crudRepo = require("./crud");

class AchievementRepository extends crudRepo  {
  constructor() {
    super(Achievement);
  }

  getAllAchievements = async () => {
    try {
      return await this.model.findAll();
    } catch (error) {
      throw new Error('Error fetching achievements: ' + error.message);
    }
  };

  getAchievementsByUserId = async (userId) => {
    try {
      // const cacheKey = `achievements:user:${userId}`;
      // const cachedAchievements = await redisClient.get(cacheKey);

      // if (cachedAchievements) {
      //   return JSON.parse(cachedAchievements);
      // }

      const achievements = await this.model.findAll({
        where: { userId }
        // include: [{ model: User }] // Uncomment if you have User model association
      });

      // await redisClient.set(cacheKey, JSON.stringify(achievements), 'EX', 3600); // Cache for 1 hour

      return achievements;
    } catch (error) {
      console.error("Repository error:", error);
      throw error;
    }
  };

  getAchievementsByUserIdInCSV = async (userId) => {
    try {
      const achievements = await this.model.findAll({
        attributes: { exclude: ['userId', 'id', 'createdAt', 'updatedAt'] },
        where: { userId }
      });

      return achievements;
    } catch (error) {
      console.error("Repository error:", error);
      throw error;
    }
  };

  updateAchievement = async (id, data) => {
    try {
      const [updated] = await this.model.update(data, {
        where: { id },
        returning: true
      });

      if (!updated) {
        throw new Error('Achievement not found');
      }

      return updated;
    } catch (error) {
      console.log("Repository error:", error);
      throw error;
    }
  };

  getAchievementsByUserIdsAndStatus = async (userIds, status) => {
    try {
      return await this.model.findAll({
        where: {
          userId: userIds,
          verificationStatus: status
        }
        // include: [{ model: User }] // Uncomment if you have User model association
      });
    } catch (error) {
      console.log("Repository error:", error);
      throw error;
    }
  };
}

module.exports = AchievementRepository;
