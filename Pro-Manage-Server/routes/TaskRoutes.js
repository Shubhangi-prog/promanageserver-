const express = require("express");
const router = express.Router();
const {
  CreateTask,
  GetAllAnalytics,
  GetAllTask,
  EditTask,
  ChangeTaskType,
  DeleteTask,
  GetSharedTask,
} = require("../controller/TaskController");
const jwt = require("../middleware/Auth");

router.post("/createTask", jwt, CreateTask);
router.put("/editTask/:id", jwt, EditTask);
router.patch("/changeType/:id", jwt, ChangeTaskType);
router.delete("/deleteTask/:id", jwt, DeleteTask);
router.get("/sharedTask/:id", GetSharedTask);
router.get("/task-analytics", jwt, GetAllAnalytics);
router.post("/GetAllTask", jwt, GetAllTask);

module.exports = router;
