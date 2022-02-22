const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

require("./mongoDB");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is Running");
});

const booksRouter = require("./routes/getBooks");
app.use("/books", booksRouter);

app.listen(port, () => {
  console.log(`Server Running at Port: ${port}`);
});
