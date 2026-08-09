const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const crypto = require("crypto");



const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your First Name"],
    maxLength: [15, "Max characters of First Name is 15"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your Last Name"],
    maxLength: [25, "Max characters of Last Name is 25"],
  },
  age: {
    type: Number,
    required: [true, "Please enter your Age"],
    max: [120, "Maximum Age is 120 Years"],
    min: [1, "Minimum Age is 1 Year"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: [true, "This Email is already in use"],
    lowercase: [true, "Email must be lowercase characters"],
    validate: [validator.isEmail, "Please Enter a valid Email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your Password"],
    minLength: [4, "Min characters of Password is 4"],
    maxLength: [25, "Max characters of Password is 25"],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, "Please Confirm Password"],
    validate: {
      validator: function(value) {
        return value == this.password
      },
      message: "Password and Confirm Password fields are not same"
    }
  },
  image: {
    type: String,
    required: [true, "Please enter your Image URL"],
  },
  gender: {
    type: String,
    required: [true, "Please enter your Gender"],
    enum: {
      values: ["MALE", "FEMALE"],
      message: "Please Enter MALE or FEMALE",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  passwordResetToken: String,
  passwordResetTokenExpires: String,
});


userSchema.pre("save", async function() {
  if(!this.isModified("password")) {
    return 
  }

  this.password = await bcrypt.hash(this.password, 12)
  this.confirmPassword = undefined

  
})

userSchema.pre("validate",  function() {
  this.gender =  this.gender.toUpperCase()
})

userSchema.methods.comparePasswords = async function(pass, passDB) {
  return await bcrypt.compare(pass, passDB)
}


const User = mongoose.model("User", userSchema)

module.exports = User