const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItem");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(500).send({ message: "Requested resource not found" });
});

module.exports = router;
