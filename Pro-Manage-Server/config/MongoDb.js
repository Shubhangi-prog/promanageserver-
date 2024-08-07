const mongoose = require("mongoose");

//Db connect
const db = mongoose
  .connect(process.env.Mongo_URI)
  .then(() => {
    console.log("Succesfully connected to the DataBase");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = db;
