const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.SECRET_STR, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
};

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      accessToken: token,
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      status: "failed",
      message: "Please Enter Email and Password",
    });
    return next();
  }
  const user = await User.findOne({email}).select("+password");
  const isMatchPass = await user.comparePasswords(password, user.password);

  if (!user || !isMatchPass) {
    res.status(400).json({
      status: "failed",
      message: "Email or Password does not match!",
    });
    return next();
  }
   const token = signToken(user._id)

  res.status(201).json({
    status: "success",
    accessToken: token,
  });

};
