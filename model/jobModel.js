const { Schema, model, models } = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const jobSchema = new Schema({
  company:{
    type:String,
    required:[true,"Company name is required"],
  },
  position:{
    type:String,
    required:[true,"Position is required"]
  },
  status:{
    type:String,
    enum:['interview','declined','pending'],
    default:'pending'
  },
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
},{timestamps:true
})

const Job = models?.Job || model("Job", jobSchema);

module.exports = Job;