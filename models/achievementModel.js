const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db'); // Adjust path as needed

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // Automatically generate UUID
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  mentorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Mentors',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_Technical: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  mode: {
    type: DataTypes.ENUM('online', 'offline'),
    allowNull: false
  },
  result: {
    type: DataTypes.ENUM('participant', 'winner', 'runner up'),
    allowNull: false
  },
  proof: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  tableName: 'achievements',
  timestamps: false
});

module.exports = Achievement;
