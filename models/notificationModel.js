const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db"); // Adjust path as needed

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4, // Automatically generate UUID
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    mentorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Mentors",
        key: "id",
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "notifications", // Optional: specify table name
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

module.exports = Notification;
