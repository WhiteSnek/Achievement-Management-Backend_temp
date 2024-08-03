const validateVerificationStatus = (req, res, next) => {
  try {
    const { status } = req.params;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    next();
  } catch (error) {
    console.error("Middleware error:", error.message);

    res.status(400).json({ message: error.message });
  }
};

const validateAchievement = async (req, res, next) => {
  try {
    const {
      userId,
      name,
      description,
      location,
      date,
      result,
      verificationStatus,
    } = req.body;

    // FIXME: Uncomment this block to validate userId when project is integrated with User model
    // if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    //   return res.status(400).json({ message: "Invalid userId format" });
    // }

    const requiredFields = {
      userId,
      name,
      description,
      location,
      date,
      result,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (!["participant", "winner", "runner up"].includes(result)) {
      return res.status(400).json({ message: "Invalid result value" });
    }

    if (
      verificationStatus !== undefined &&
      !["pending", "accepted", "rejected"].includes(verificationStatus)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid value for verificationStatus" });
    }

    next();
  } catch (error) {
    console.error("Middleware error:", error.message);

    res.status(400).json({ message: error.message });
  }
};

module.exports = { validateVerificationStatus, validateAchievement };
