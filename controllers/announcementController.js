const AnnouncementRepository = require("../repositories/announcementRepository");

class AnnouncementController {
  constructor() {
    this.announcement = new AnnouncementRepository();
  }

  createAnnouncement = async (req, res) => {
    try {
      const { achievement } = req.body;
      
      if (!achievement) {
        return res.status(400).json({ error: "Achievement ID is required" });
      }

      const data = {
        achievement
      };

      const announcement = await this.announcement.create(data);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getAnnouncements = async (req, res) => {
    try {
      const announcements = await this.announcement.getAnnouncements();
      res.status(200).json(announcements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getAnnouncement = async (req, res) => {
    try {
      const { id } = req.params;
      const announcement = await this.announcement.getOne(id);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.status(200).json(announcement);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateAnnouncementMessage = async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = req.body;

      if (message === undefined) {
        return res.status(400).json({ error: "Message field is required" });
      }

      const updatedAnnouncement = await this.announcement.update(id, { message });
      if (!updatedAnnouncement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.status(200).json(updatedAnnouncement);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  removeAnnouncement = async (req, res) => {
    try {
      const { id } = req.params;
      const announcement = await this.announcement.destroy(id);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.status(200).json({ message: "Announcement removed successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new AnnouncementController();
