const { BadRequest } = require("../middleware");
const {StatusCodes} = require("http-status-codes")
const User = require("../model/userModel")
const login = async (req,res)=>{
  const {email,password} = req?.body;
  if(!email || !password){
    throw new BadRequest("Please fill in all fields")
  }
  const user = await User.findOne({email});
  if(!user){
    throw new BadRequest("Invalid credentials")
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if(!isPasswordCorrect){
    throw new BadRequest("Invalid credentials")
  }
  const token = user.generateToken();
  res.status(StatusCodes.OK).json({
    message:'User logged in successfully',
    token,
    user
  })
}

const register = async (req,res)=>{
  const {name,email,password} = req.body;
  if(!name || !email || !password){
    throw new BadRequest("Please fill in all fields")
  }
  const user = await User.findOne({email});
  if(user){
    throw new BadRequest("User already exists")
  }
  const newUser = await User.create({name,email,password});
  const token = newUser.generateToken();
  res.status(StatusCodes.CREATED).json({
    message:'User created successfully',
  })
}

const protect = async (req,res)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer")){
    throw new BadRequest("Invalid token")
  }
  const token = authHeader.split(" ")[1];
  if(!token){
    throw new BadRequest("Invalid token")
  }
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if(!user){
    throw new BadRequest("User not found")
  }
  req.user = user;
  next()
}


module.exports = {
  login ,
  register
}