const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db'); // Correct path for Sequelize instance

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    },
    allowNull: true
  },
  mentorId: {
    type: DataTypes.UUID,
    references: {
      model: 'Mentors',
      key: 'id'
    },
    allowNull: true
  },
  achievementId: {
    type: DataTypes.UUID,
    references: {
      model: 'Achievements',
      key: 'id'
    },
    allowNull: true
  }
}, {
  tableName: 'requests',
  timestamps: true
});


module.exports = Request;
