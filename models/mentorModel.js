const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db'); // Adjust path as needed
const User = require('./userModel'); // Ensure path is correct

const Mentor = sequelize.define('Mentor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // Automatically generate UUID
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      is: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    }
  }
}, {
  tableName: 'mentors',
  timestamps: false
});

// Define relationships
Mentor.hasMany(User, {
  foreignKey: 'mentorId',
  as: 'students'
});

User.belongsTo(Mentor, {
  foreignKey: 'mentorId',
  as: 'mentor'
});

module.exports = Mentor;
