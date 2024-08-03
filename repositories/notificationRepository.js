const Notification = require("../models/notificationModel");
const crudRepo = require("./crud");

class NotificationRepository extends crudRepo {
  constructor() {
    super(Notification);
  }

  getNotificationsbyUserId = async (userId) => {
    try {
      const notifications = await this.model.findAll({
        where: { userId: userId }
      });
      return notifications;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  addNotification = async (data) => {
    try {
      const newNotification = await this.model.create(data);
      return newNotification;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = NotificationRepository;
