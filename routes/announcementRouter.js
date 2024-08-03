const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

router.post('/', announcementController.createAnnouncement);
router.get('/', announcementController.getAnnouncements);
router.get('/:id', announcementController.getAnnouncement);
router.put('/:id/message', announcementController.updateAnnouncementMessage);
router.delete('/:id', announcementController.removeAnnouncement);

module.exports = router;
