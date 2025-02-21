const { default: mongoose } = require("mongoose");


const connectToDB = async ()=>{
  await mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("DB connected successfully");
  }).catch(err=> console.log(`error connect to db ${err?.message}`));
  
}

module.exports = connectToDB;

