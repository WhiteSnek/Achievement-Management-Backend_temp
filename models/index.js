const User = require('./userModel');
const Mentor = require('./mentorModel');
const Achievement = require('./achievementModel');
const Request = require('./requestModel');

// Define associations
User.hasMany(Request, { foreignKey: 'userId' });
Mentor.hasMany(Request, { foreignKey: 'mentorId' });
Achievement.hasMany(Request, { foreignKey: 'achievementId' });

Request.belongsTo(User, { as: 'Users', foreignKey: 'userId' });
Request.belongsTo(Mentor, { as: 'Mentors', foreignKey: 'mentorId' });
Request.belongsTo(Achievement, { as: 'Achievements', foreignKey: 'achievementId' });

// Export models
module.exports = { User, Mentor, Achievement, Request };
