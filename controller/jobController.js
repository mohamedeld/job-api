const { StatusCodes } = require("http-status-codes");
const Job = require("../model/jobModel");
const moment = require("moment");
const mongoose = require("mongoose");
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
  const {search,status,jobType,sort} = req?.query;
  const queryObject = {
    createdBy:req?.user?._id
  }
  if(search){
    queryObject.position = {$regex:search,$options:'i'}
  }
  if(status && status !== 'all'){
    queryObject.status = status;
  }
  if(jobType && jobType !== 'all'){
    queryObject.jobType = jobType;
  }
  let result = Job.find(queryObject);
  if(sort === 'latest'){
    result = result.sort('-createdAt')
  }
  if(sort === 'oldest'){
    result = result.sort('createdAt')
  }
  if(sort === 'a-z'){
    result = result.sort('position')
  }
  if(sort === 'z-a'){
    result = result.sort('-position')
  }
  const page = Number(req?.query?.page) || 1;
  const limit = Number(req?.query?.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({
    jobs,
  totalJobs,
  numOfPages
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

const jobStats = async(req,res)=>{
  let stats = await Job.aggregate([
    { $match:{createdBy: mongoose.Schema.Types.ObjectId(req?.user?._id) } },
    {$group:{_id:"$status",count:{$sum:1}}}
  ])
  stats = stats?.reduce((acc,curr)=> {
    const {_id:title,count} = curr;
    acc[title] = count
    return acc;
  },{})
  const defaultStats = {
    pending:stats?.pending || 0,
    interview:stats?.interview || 0,
    declined:stats?.declined || 0
  }
  res.status(StatusCodes.OK).json({
    defaultStats,
    monthlyApplications:[]
  })
}

module.exports = {
  createJob ,
  deleteJob,
  updateJob,
  getAllJobs,
  getJob
}