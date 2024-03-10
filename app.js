const express = require("express");
const app = express();

const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const { PORT = 3001 || 3000 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });

const routes = require("./routes");

app.use(cors());
app.use(express.json());
app.use(routes);
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
