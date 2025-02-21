const express = require("express");
require("express-async-errors");
const helment = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app= express();
const dotenv = require("dotenv");
const connectToDB = require("./db");
const errorHandlerMiddleware = require("./middleware/globalError");
dotenv.config();

const jobRoute = require("./routes/jobRoute");
const userRoute = require("./routes/userRoute");

app.use(express.json())
app.use(helment());
app.use(cors());
app.use(xss());
app.use(rateLimit({
  windowMs:15*60*1000,
  max:100
}));
app.use("/api/v1/jobs",jobRoute);
app.use("/api/v1/users",userRoute);

app.use((req,res,next)=>{
  res.status(404).json({
    message:"Not found"
  })
})

app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000;

const start = async ()=>{
  try{
    await connectToDB();
  }catch(error){
    console.log(error);
  }
}
// Start the server
const startServer = () => {
  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
};

// Connect to the database and then start the server
start().then(startServer);