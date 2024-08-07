const express = require("express");
const jwt_verify = require("../middleware/Auth");
const UserLoggedAuth = require("../middleware/userLoggedAuth");
const {
  CreateUser,
  LoginUser,
  IsLoggedIn,
  UpdateDetails,
} = require("../controller/UserController");
const router = express.Router();

router.post("/register", CreateUser);
router.post("/loginUser", LoginUser);
router.post("/IsUser", UserLoggedAuth, IsLoggedIn);
router.put("/UpdateUserDetails", jwt_verify, UpdateDetails);

module.exports = router;
