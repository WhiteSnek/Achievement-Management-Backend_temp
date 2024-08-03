const { Achievement, User, Mentor, Request } = require('../models'); // Import all models
const crudRepo = require('./crud');
class RequestRepository extends crudRepo {
  constructor() {
    super(Request);
  }

  getRequestsByMentorId = async (mentorId) => {
    try {
      const requests = await this.model.findAll({
        where: { mentorId },
        include: [
          { model: Achievement, as: 'Achievements' },
          { model: User, as: 'Users' },
          { model: Mentor, as: 'Mentors' }
        ]
      });
      return requests;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  addRequest = async (data) => {
    try {
      const newRequest = await this.model.create(data);
      return newRequest;
    } catch (err) {
      throw new Error(err.message);
    }
  };
}

module.exports = RequestRepository;
