const { promisify } = require("util");
const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const sendPasswordResetEmail = require("./../Utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.SECRET_STR, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
};

const sendSecuredToken = (user, res, status, message) => {
  const token = signToken(user._id);

  const options = {
    maxAge: +process.env.TOKEN_EXPIRE,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.cookie("jwt", token, options);

  user.password = undefined;

  res.status(status).json({
    status: "success",
    accessToken: token,
    message: message,
    user: user,
  });
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      userList: users,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    sendSecuredToken(newUser, res, 201, "Account Has Succesfully Created");
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
    return res.status(400).json({
      status: "failed",
      message: "Please Enter Email and Password",
    });
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      status: "failed",
      message: "Email or Password does not match!",
    });
  }

  const isMatchPass = await user.comparePasswords(password, user.password);

  if (!isMatchPass) {
    return res.status(400).json({
      status: "failed",
      message: "Email or Password does not match!",
    });
    // return next();
  }

  sendSecuredToken(user, res, 201, "You Have Succesfully Signed In.");
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
        message: "No user found with this email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      status: "success",
      message: "Reset email sent successfully!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({ validateBeforeSave: false });
    return res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "failed",
      message: "Token is invalid or expired.",
    });
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  user.save();

  //Log in Again

  if (req.body.password === req.body.confirmPassword) {
    sendSecuredToken(newUser, res, 201, "Your Password has Changed.");
  } else {
    return res.status(400).json({
      status: "failed",
      message: "Password and Confirm Password fields don`t Match!",
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePasswords(req.body.currentPassword, user.password))) {
    return res.status(400).json({
      status: "failed",
      message: "Current Password is wrong, Try Again.",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      status: "failed",
      message: "new Password and Confirm Password Fields are not match!",
    });
  }
  //---

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  await user.save();

  //---

  sendSecuredToken(user, res, 200, "Your Password has Changed.");
};

//------USER UPDATE----------

function requestedObj(reqObj, ...properties) {
  const userObject = {};

  const notAllowedFields = Object.keys(reqObj).filter(
    (item) => !properties.includes(item),
  );

  if (notAllowedFields.length > 0) {
    throw new Error(
      `You are not allowed to update: ${notAllowedFields.join(", ")}`,
    );
  }

  Object.keys(reqObj).forEach((item) => {
    if (properties.includes(item)) {
      userObject[item] = reqObj[item];
    }
  });
  return userObject;
}

exports.updateUserAccount = async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return res.status(400).json({
      status: "failed",
      message: "You Can Not Change Your Password Here.",
    });
  }
  try {
    const filteredObject = requestedObj(
      req.body,
      "firstName",
      "lastName",
      "age",
      "image",
      "gender",
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredObject,
      { runValidators: true, returnDocument: "after" },
    );

    res.status(200).json({
      status: "success",
      message: "Your Account has Changed.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.deleteUserAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.status(204).json({
      status: "success",
      user: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
