const { promisify } = require("util");
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



exports.protectRoute = async (req, res, next) => {
  try {
     //1. Check Token
  const tokenToTest = req.headers.authorization
  let token;

  if(tokenToTest && tokenToTest.startsWith("bearer")) {
    token = tokenToTest.split(" ")[1]
  }

  console.log(token);

  if(!token) {
    return res.status(401).json({
      status: "failed",
      message: "You Aren`t Signed in. Please Sign In To Your Account."
    })
  }
  

  //2. Validate Token


   const decodedToken = await promisify(jwt.verify)(token, process.env.SECRET_STR);


  //3.Password changed or not



  //4. Allow user
  next()
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: error.message
    })
  }
 
}