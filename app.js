const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 || 3000 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });

app.use((req, res, next) => {
  req.user = {
    _id: "65c99a62f47e3c78345e21ba",
  };
  next();
});

const routes = require("./routes");

app.use(express.json());
app.use(routes);
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
