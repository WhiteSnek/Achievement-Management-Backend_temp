const User = require("../models/userModel");
const crudRepo = require("./crud");

class userRepository extends crudRepo {
  constructor() {
    super(User);
  }

  addStudent = async (data) => {
    try {
      const user = await this.model.create(data);
      return user;
    } catch (error) {
      throw error;
    }
  };

  getStudentById = async (userId) => {
    try {
      const user = await this.model.findById(userId);
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw error;
    }
  };

  getAllStudents = async () => {
    try {
      const users = await this.model.find();
      return users;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = userRepository;
