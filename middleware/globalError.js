const { CustomAPIError } = require("./custom-error");
const {StatusCodes} = require("http-status-codes");
const errorHandlerMiddleware = (err,req,res,next)=>{
  if(err instanceof CustomAPIError){
    return res.status(err.statusCode).json({err:err.message});
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err:err});
}

module.exports = errorHandlerMiddleware;