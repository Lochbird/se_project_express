const router = require("express").Router();
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const clothingItemRouter = require("./clothingItem");
const { NotFoundError } = require("../utils/errors");

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NotFoundError).send({ message: "Requested resource not found" });
});

module.exports = router;
