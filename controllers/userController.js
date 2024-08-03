const userRepo = require("../repositories/userRepository");

class userController {
  constructor() {
    this.user = new userRepo();
  }
  addStudent = async (req, res) => {
    try {
      const user = await this.user.addStudent(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  getStudentById = async (req, res) => {
    try {
      const user = await this.user.getStudentById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  getAllStudents = async (req, res) => {
    try {
      const user = await this.user.getAllStudents();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

module.exports = new userController();
