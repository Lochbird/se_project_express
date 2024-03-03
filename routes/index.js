const router = require("express").Router();
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const clothingItem = require("./clothingItem");
const { NotFoundError } = require("../utils/errors");
const { validateNewUser, validateLogin } = require("../middlewares/validation");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.post("/signin", validateLogin, login);
router.post("/signup", validateNewUser, createUser);

router.use((req, res) => {
  res.status(NotFoundError).send({ message: "Requested resource not found" });
});

module.exports = router;
