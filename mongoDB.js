const mongoose = require("mongoose");

module.exports = mongoose
  .connect(process.env.mongoDB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
