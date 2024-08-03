const Announcement = require("../models/announcementModel");
const crudRepo = require("./crud");

class announcementRepository extends crudRepo {
  constructor() {
    super(Announcement);
  }
  getAnnouncements = async () => {
    try {
      const announcements = await Announcement.find()
      .populate({
        path: 'achievement',
        select: 'name description location date result userId',
        populate: {
          path: 'userId',
          select: 'name branch_section enrollmentNumber'
        }
      })
      .select('created_at');
      return announcements
    } catch (error) {
      console.log("crud error : " + error);
    }
  }
  update = async (id, updateFields) => {
    try {
      const updatedAnnouncement = await this.model.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true } // `new: true` returns the updated document
      );
      return updatedAnnouncement;
    } catch (error) {
      console.log("crud error : " + error);
      throw error;
    }
  };
}

module.exports = announcementRepository;
