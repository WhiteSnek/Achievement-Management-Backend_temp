const RequestRepository = require("../repositories/requestRepository");
// const redis = require("redis")
const dotenv = require("dotenv");

dotenv.config()

// const redisClient = redis.createClient({
//   url: process.env.REDIS_URL // Update with your Redis server URL if different
// });
// redisClient.connect().catch(console.error);

class RequestController {
  constructor() {
    this.request = new RequestRepository();
  }

  getRequests = async (req, res) => {
    try {
      const mentorId = req.params.mentorId;

    // Check cache first
    // const cacheKey = `requests:${mentorId}`;
    // const cachedRequests = await redisClient.get(cacheKey);

    // if (cachedRequests ) {
    //   return res.status(200).json(JSON.parse(cachedRequests ));
    // }
    //   console.log(mentor)
      const requests = await this.request.getRequestsByMentorId(mentorId);
      // await redisClient.set(cacheKey, JSON.stringify(requests), {
      //   EX: 3600, // Cache expiration time in seconds
      // });
      res.status(200).json(requests);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  addRequest = async (req, res) => {
    try {
      const data = req.body;
      console.log(data)
      const newRequest = await this.request.addRequest(data);
      res.status(201).json(newRequest);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  deleteRequest = async (req, res) => {
    try {
      const request = await this.request.destroy(req.params.id);
      res.status(200).json(request);
    } catch (error) {
      console.log("controller error : " + error);
      res.status(400).json({ message: error.message });
    }
  };
}

module.exports = new RequestController();
