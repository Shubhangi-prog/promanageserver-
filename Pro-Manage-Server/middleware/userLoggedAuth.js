const jwt = require("jsonwebtoken");

const UserLoggedAuth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.json({ IsUser: false });
    }
    req.body.userID = decode.userID;
    next();
  } catch (error) {
    res.json({ IsUser: false });
  }
};

module.exports = UserLoggedAuth;
