const express =require("express");
const {login,register,protect,updateUser} = require("../controller/userController")
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route('/profile/:id').patch(protect,updateUser)


module.exports = router;