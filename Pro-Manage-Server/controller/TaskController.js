const e = require("cors");
const Task = require("../model/TaskModel");
const user = require("../model/User");

const CreateTask = async (req, res, next) => {
  try {
    const { title, priority, checkList, dueDate, taskType, color } = req.body;
    const createdBy = req.body.userId;
    if (!title || !priority || !checkList || !taskType || !createdBy) {
      res.status(400).json({ message: "Bad request" });
    }

    const newTask = new Task({
      title,
      priority,
      checkList,
      dueDate: dueDate ? dueDate : null,
      color,
      taskType,
      createdBy,
    });

    await newTask.save();

    res.status(200).json({ msg: "task created Successfully" });
  } catch (error) {
    console.log(error);
    next(new Error(error));
  }
};

const EditTask = async (req, res) => {
  const { id } = req.params; // ObjectId of the task to update
  const { title, priority, checkList, dueDate, taskType } = req.body; // Fields to update
  try {
    // Update the Task
    const result = await Task.updateOne(
      { _id: id },
      { $set: { title, priority, checkList, dueDate, taskType } } // Set the fields to update
    );

    // Check if the Task was found and updated
    if (result.nModified === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const ChangeTaskType = async (req, res) => {
  const { id } = req.params; // ObjectId of the task to update
  const { taskType } = req.body; // Fields to update
  try {
    // Update the Task
    const result = await Task.updateOne(
      { _id: id },
      { $set: { taskType } } // Set the fields to update
    );

    // Check if the Task was found and updated
    if (result.nModified === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetAllAnalytics = async (req, res, next) => {
  try {
    const createdBy = await user.findById(req.body.userId);
    const backlog = await Task.find({
      createdBy: createdBy._id,
      taskType: "backlog",
    }).count();
    const todo = await Task.find({
      createdBy: createdBy._id,
      taskType: "todo",
    }).count();
    const inProgress = await Task.find({
      createdBy: createdBy._id,
      taskType: "in-progress",
    }).count();
    const done = await Task.find({
      createdBy: createdBy._id,
      taskType: "done",
    }).count();
    const lowPriority = await Task.find({
      createdBy: createdBy._id,
      priority: "LOW PRIORITY",
    }).count();
    const moderatePriority = await Task.find({
      createdBy: createdBy._id,
      priority: "MODERATE PRIORITY",
    }).count();
    const highPriority = await Task.find({
      createdBy: createdBy._id,
      priority: "HIGH PRIORITY",
    }).count();
    const duedate = await Task.find({
      createdBy: createdBy._id,
      dueDate: { $exists: true },
    }).count();

    res.status(200).json({
      allBacklogTask: backlog,
      allTodoTask: todo,
      allInProgress: inProgress,
      allDoneTask: done,
      allLowPriorityTask: lowPriority,
      allModeratePriorityTask: moderatePriority,
      allHighPriorityTask: highPriority,
      allDuedateTask: duedate,
    });
  } catch (error) {
    console.log(error);
    next(new Error(error));
  }
};

const GetAllTask = async (req, res, next) => {
  try {
    const createdBy = await user.findById(req.body.userId);
    const { duration } = req.body;
    const currentDate = new Date();
    if (duration == "Today") {
      // Calculate the start of the day
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

      // Calculate the end of the day
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds to end of day

      const response = await Task.find({
        createdBy: createdBy._id,
        createdAt: {
          $gte: startOfDay.toISOString(), // Convert to ISOString format
          $lt: endOfDay.toISOString(), // Convert to ISOString format
        },
      });
      return res.status(200).json({ response, msg: "Success" });
    } else if (duration == "This week") {
      // Calculate the date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const response = await Task.find({
        createdBy: createdBy._id,
        createdAt: {
          $gte: sevenDaysAgo.toISOString(), // Convert to ISOString format
          $lt: currentDate.toISOString(), // Convert to ISOString format
        },
      });
      return res.status(200).json({ response, msg: "Success" });
    } else if (duration == "This Month") {
      // Calculate the date 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const response = await Task.find({
        createdBy: createdBy._id,
        createdAt: {
          $gte: thirtyDaysAgo.toISOString(), // Convert to ISOString format
          $lt: currentDate.toISOString(), // Convert to ISOString format
        },
      });
      return res.status(200).json({ response, msg: "Success" });
    }

    const response = await Task.find({
      createdBy: createdBy._id,
    });
    res.status(200).json({ response, msg: "Success" });
  } catch (error) {
    console.log(error);
    next(new Error(error));
  }
};

const DeleteTask = async (req, res) => {
  const { id } = req.params; // ObjectId of the task to update
  try {
    // Update the Task
    const result = await Task.deleteOne({ _id: id });

    // Check if the Task was found and updated
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetSharedTask = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Task.findOne(
      { _id: id },
      { _id: 0, createdBy: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    );
    if (response) {
      return res.status(200).json({ response });
    } else {
      return res.status(404).json({
        error: "Task Deleted",
        message:
          "The task you are trying to access has been deleted by the user.",
      });
    }
  } catch (error) {
    res.status(404).json({
      error,
      message:
        "The task you are trying to access has been deleted by the user.",
    });
  }
};

module.exports = {
  CreateTask,
  GetAllAnalytics,
  GetAllTask,
  EditTask,
  ChangeTaskType,
  DeleteTask,
  GetSharedTask,
};
