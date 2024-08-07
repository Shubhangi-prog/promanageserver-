const mongoose = require("mongoose");

const checkListSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
  },
});

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    checkList: {
      type: [checkListSchema],
      default: [],
      required: true,
    },
    dueDate: {
      type: String,
    },
    color: {
      type: String,
    },
    taskType: {
      type: String,
      default: "todo",
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
  },
  { timestamps: true }
);

// Define pre-save middleware to filter out null or undefined values
TaskSchema.pre("save", function (next) {
  const task = this;

  // Filter out null or undefined values
  Object.keys(task._doc).forEach((key) => {
    if (task._doc[key] === null || task._doc[key] === undefined) {
      delete task._doc[key];
    }
  });

  next();
});

module.exports = mongoose.model("Task", TaskSchema);
