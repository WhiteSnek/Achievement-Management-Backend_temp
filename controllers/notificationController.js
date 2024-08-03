const NotificationRepository = require("../repositories/notificationRepository");
const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config()

// const redisClient = redis.createClient({
//   url: process.env.REDIS_URL, // Update with your Redis server URL if different
// });
// redisClient.connect().catch(console.error);

class NotificationController {
  constructor() {
    this.notification = new NotificationRepository();
  }

  getNotifications = async (req, res) => {
    try {
      const userId = req.params.userId;
      // const cacheKey = `notifications:${userId}`;
      // const cachedNotifications = await redisClient.get(cacheKey);

      // if (cachedNotifications) {
      //   return res.status(200).json(JSON.parse(cachedNotifications));
      // }
      const notifications = await this.notification.getNotificationsbyUserId(
        userId
      );
      // await redisClient.set(cacheKey, JSON.stringify(notifications), {
      //   EX: 3600, // Cache expiration time in seconds
      // });
      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  addNotification = async (req, res) => {
    try {
      const data = req.body;
      const newNotification = await this.notification.addNotification(data);
      res.status(201).json(newNotification);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
}

module.exports = new NotificationController();
