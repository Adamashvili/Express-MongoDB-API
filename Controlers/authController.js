const User = require("./../Models/userModel");

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: "success",
        user: newUser
    })
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
