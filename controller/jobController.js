const { StatusCodes } = require("http-status-codes");
const Job = require("../model/jobModel")
const createJob = async (req,res)=>{
  const {company,position,status} = req?.body;
  if(!company || !position){
    throw new BadRequest("Please fill in all fields")
  }
  const job = await Job.create({company,position,status,createdBy:req.user._id});
  res.status(StatusCodes.CREATED).json({
    message:'Job created successfully',
    job
  })
}

const getAllJobs = async (req,res)=>{
  const jobs = await Job.find({createdBy:req.user._id}).sort("createdAt");
  res.status(StatusCodes.OK).json({
    jobs,
  count:jobs?.length
  })
}

const getJob = async (req,res)=>{
  const {id:jobId} = req.params;
  const job = await Job.findOne({_id:jobId,createdBy:req.user._id});
  if(!job){
    throw new NotFound(`No job with id : ${jobId}`)
  }
  res.status(StatusCodes.OK).json({
    job
  })
}
const updateJob = async (req,res)=>{
  const {id:jobId} = req.params;
  const {company,position,status} = req?.body;
  if(!company || !position){
    throw new BadRequest("Please fill in all fields")
  }
  const job = await Job.findOneAndUpdate({_id:jobId,createdBy:req.user._id},{company,position,status},{new:true,runValidators:true});
  if(!job){
    throw new NotFound(`No job with id : ${jobId}`)
  }
  res.status(StatusCodes.OK).json({
    message:'Job updated successfully',
    job
  })
}
const deleteJob = async (req,res)=>{
  const {id:jobId} = req.params;
  const job = await Job.findOneAndDelete({_id:jobId,createdBy:req.user._id});
  if(!job){
    throw new NotFound(`No job with id : ${jobId}`)
  }
  res.status(StatusCodes.OK).json({
    message:'Job deleted successfully',
  })
}

module.exports = {
  createJob ,
  deleteJob,
  updateJob,
  getAllJobs,
  getJob
}