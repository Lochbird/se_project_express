const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItem");
const { InternalServerError } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use((req, res) => {
  res
    .status(InternalServerError)
    .send({ message: "Requested resource not found" });
});

module.exports = router;