const express = require("express");
require("express-async-errors")
const app= express();
const dotenv = require("dotenv");
const connectToDB = require("./db");
const errorHandlerMiddleware = require("./middleware/globalError");
dotenv.config();

app.use(express.json())


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