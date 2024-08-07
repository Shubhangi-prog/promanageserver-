const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
//Body Parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//routes
const userRoute = require("./routes/userRoutes");
const taskRoute = require("./routes/TaskRoutes");
const Port = process.env.PORT || 3000;

//Db connection
require("./config/MongoDb");

// Health check Api
app.get("/health", (req, res) => {
  res.json({
    message: "Server is Running Fine from Promanage",
    status: "Active",
    time: new Date(),
  });
});

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/task", taskRoute);
// Listening on port
app.listen(3000, () => {
  console.log("Port is active  ");
});
