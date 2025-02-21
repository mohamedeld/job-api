const { CustomAPIError } = require("./custom-error");
const {StatusCodes} = require("http-status-codes");
const errorHandlerMiddleware = (err,req,res,next)=>{

  let customError = {
    statusCode : err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err?.message || 'Something went wrong',

  }
  if(err instanceof CustomAPIError){
    return res.status(customError?.statusCode).json({message:customError?.message});
  }
  if(err?.name === "ValidationError"){
    customError.statusCode = StatusCodes.BAD_REQUEST;
    const messages = Object.values(err?.errors)?.map((item)=>item?.message);
    customError.message = `Validation Error: ${messages.join(", ")}`;
  }
  if(err?.code && err?.code === 11000){
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} please choose another value`;
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err:err});
}

module.exports = errorHandlerMiddleware;