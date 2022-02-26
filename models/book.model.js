const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  genre: {
    type: String,
  },
});

module.exports = mongoose.model("Book", booksSchema);
