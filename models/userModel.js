const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db'); // Adjust path as needed

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // Automatically generate UUIDv4
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enrollmentNumber: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [0, 11]
    }
  },
  branch_section: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      is: /^[a-zA-Z0-9._%+-]+@bpitindia\.edu\.in$/
    }
  },
  mentorId: {
    type: DataTypes.UUID,
    references: {
      model: 'Mentors',
      key: 'id'
    }
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
