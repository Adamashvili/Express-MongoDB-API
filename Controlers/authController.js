const { promisify } = require("util");
const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const sendPasswordResetEmail  = require("./../Utils/email");
const crypto = require("crypto")
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
  const user = await User.findOne({ email }).select("+password");
  const isMatchPass = await user.comparePasswords(password, user.password);

  if (!user || !isMatchPass) {
    res.status(400).json({
      status: "failed",
      message: "Email or Password does not match!",
    });
    return next();
  }
  const token = signToken(user._id);

  res.status(201).json({
    status: "success",
    accessToken: token,
  });
};

exports.protectRoute = async (req, res, next) => {
  //1. Check Token
  const tokenToTest = req.headers.authorization;
  let token;

  if (tokenToTest && tokenToTest.startsWith("Bearer")) {
    token = tokenToTest.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "You Aren`t Signed in. Please Sign In To Your Account.",
    });
  }

  //2. Validate Token

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.SECRET_STR,
  );

  //3. If user still on site

  let user = await User.findById(decodedToken.id);

  if (!user) {
    return res.status(401).json({
      status: "failed",
      message: "User is no Longer exists.",
    });
  }

  //4. Allow user
  req.user = user;
  next();
};

exports.onlyForAdmin = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401).json({
        status: "failed",
        message: "You don`t have a permission to do this action!",
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found with this email"
      });
    }

   
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    

    await user.save({ validateBeforeSave: false });
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      status: "success",
      message: "Reset email sent successfully!"
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message
    });
  }
};


exports.resetPassword = (req, res, next) => {};
