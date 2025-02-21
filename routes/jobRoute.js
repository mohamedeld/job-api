const express =require("express");
const {createJob,updateJob,deleteJob,getAllJobs,getJob} = require("../controller/jobController")
const router = express.Router();

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getJob).put(updateJob).delete(deleteJob);
module.exports = router;