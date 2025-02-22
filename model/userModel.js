const { Schema, model, models } = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: 3,
    maxLength: 50
  },
  lastName:{
    type:String,
    required:[true,"last name is required"],
    default:'lastName'
  },
  email: {
    type: String,
    required: [true, "name is required"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email"
    ],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: 6
  },
  location:{
    type:String,
    required:[true,"Please enter your location"],
    trim:true,
    default:'my location'
  }
})

const User = models?.User || model("User", userSchema);
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      next()
    }
    const hashSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, hashSalt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error)
  }
})
userSchema.methods.generateToken = function (){
  return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:"30d"})
}
module.exports = User;